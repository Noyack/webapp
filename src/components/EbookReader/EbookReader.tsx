// src/components/EbookReader/EbookReader.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Loader, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Bookmark,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import ebooksService, { EbookMetadata, PageData } from '../../services/ebooks.service';
import './EbookReader.css';

// Import PDF.js for frontend PDF rendering
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface EbookReaderProps {
  ebookId: string;
  onClose: () => void;
}

interface PageCache {
  [pageNumber: number]: PageData;
}

const EbookReader: React.FC<EbookReaderProps> = ({ ebookId, onClose }) => {
  const [metadata, setMetadata] = useState<EbookMetadata | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<PageCache>({});
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [renderedPageImages, setRenderedPageImages] = useState<{[key: number]: string}>({});
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set()); // Track which pages are currently loading
  
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Load PDF.js when component mounts
  useEffect(() => {
    const loadPdfJs = async () => {
      if (!window.pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
        
        // Set worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    };
    
    loadPdfJs();
  }, []);

  // Initialize reader
  useEffect(() => {
    initializeReader();
  }, [ebookId]);

  // Auto-hide controls
  useEffect(() => {
    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => {
      setShowControls(true);
      resetTimeout();
    };

    document.addEventListener('mousemove', handleMouseMove);
    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation with debouncing
  useEffect(() => {
    let keyPressTimeout: NodeJS.Timeout;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      // Clear any pending key press
      if (keyPressTimeout) {
        clearTimeout(keyPressTimeout);
      }
      
      // Debounce rapid key presses
      keyPressTimeout = setTimeout(() => {
        switch (e.key) {
          case 'ArrowLeft':
            if (currentPage > 1) {
              goToPage(currentPage - 1);
            }
            break;
          case 'ArrowRight':
            if (metadata && currentPage < metadata.totalPages) {
              goToPage(currentPage + 1);
            }
            break;
          case 'Escape':
            onClose();
            break;
          case 'f':
          case 'F':
            toggleFullscreen();
            break;
        }
      }, 100); // 100ms debounce
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (keyPressTimeout) {
        clearTimeout(keyPressTimeout);
      }
    };
  }, [currentPage, metadata]);

  const initializeReader = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get ebook metadata
      const ebookMetadata = await ebooksService.getEbookMetadata(ebookId);
      setMetadata(ebookMetadata);
      
      // Load first page
      await loadPage(1);
      
      // Preload next few pages
      preloadPages(1, 3);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ebook');
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (pageNumber: number): Promise<PageData> => {
    // Check cache first
    if (pageCache[pageNumber]) {
      return pageCache[pageNumber];
    }

    // Check if this page is already being loaded
    if (loadingPages.has(pageNumber)) {
      // Wait for the existing load to complete
      return new Promise((resolve, reject) => {
        const checkCache = () => {
          if (pageCache[pageNumber]) {
            resolve(pageCache[pageNumber]);
          } else if (!loadingPages.has(pageNumber)) {
            // Loading failed, reject
            reject(new Error(`Failed to load page ${pageNumber}`));
          } else {
            // Still loading, check again in 100ms
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    try {
      // Mark this page as loading
      setLoadingPages(prev => new Set(prev).add(pageNumber));
      setPageLoading(true);
      
      const pageData = await ebooksService.getEbookPage(ebookId, pageNumber);
      
      // If it's a PDF URL, render it using PDF.js
      if (pageData.contentType === 'image' && pageData.content.startsWith('http')) {
        try {
          const renderedImage = await renderPdfPage(pageData.content, pageNumber);
          pageData.content = renderedImage;
        } catch (pdfError) {
          console.error('PDF rendering failed, falling back to iframe:', pdfError);
          // Fallback: create an iframe embed for the PDF
          pageData.content = `
            <div style="width: 100%; height: 80vh; display: flex; justify-content: center; align-items: center;">
              <iframe 
                src="${pageData.content}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0" 
                width="100%" 
                height="100%" 
                style="border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15);"
                title="PDF Page ${pageNumber}"
              ></iframe>
            </div>
          `;
          pageData.contentType = 'html';
        }
      }
      
      // Cache the page
      setPageCache(prev => ({
        ...prev,
        [pageNumber]: pageData
      }));
      
      return pageData;
    } catch (err) {
      throw new Error(`Failed to load page ${pageNumber}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      // Remove from loading set
      setLoadingPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageNumber);
        return newSet;
      });
      setPageLoading(false);
    }
  };

  const renderPdfPage = async (pdfUrl: string, pageNumber: number): Promise<string> => {
    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF.js not loaded');
      }

      // Fetch PDF from URL
      const response = await fetch(pdfUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      
      // Load PDF document
      const pdf = await window.pdfjsLib.getDocument({ data: pdfData }).promise;
      const page = await pdf.getPage(pageNumber);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const scale = 2.0; // Higher scale for better quality
      const viewport = page.getViewport({ scale });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert to data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      throw error;
    }
  };

  const preloadPages = async (startPage: number, count: number) => {
    if (!metadata) return;
    
    const promises = [];
    for (let i = 1; i <= count; i++) {
      const pageNumber = startPage + i;
      if (pageNumber <= metadata.totalPages && !pageCache[pageNumber]) {
        promises.push(loadPage(pageNumber).catch(() => {})); // Silently fail preloading
      }
    }
    
    await Promise.all(promises);
  };

  const goToPage = async (pageNumber: number) => {
    if (!metadata || pageNumber < 1 || pageNumber > metadata.totalPages) return;
    
    // Don't navigate if we're already on this page
    if (pageNumber === currentPage) return;
    
    try {
      // Set the current page immediately for UI responsiveness
      setCurrentPage(pageNumber);
      
      // Load the page in the background
      await loadPage(pageNumber);
      
      // Preload surrounding pages
      preloadPages(pageNumber, 2);
      
      // Clear old cached pages to manage memory
      cleanupCache(pageNumber);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
      // Revert to previous page on error
      setCurrentPage(prev => prev);
    }
  };

  const nextPage = () => {
    if (metadata && currentPage < metadata.totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const cleanupCache = (currentPageNumber: number) => {
    const cacheWindow = 5; // Keep 5 pages before and after current page
    const newCache: PageCache = {};
    
    Object.keys(pageCache).forEach(pageStr => {
      const pageNum = parseInt(pageStr);
      if (Math.abs(pageNum - currentPageNumber) <= cacheWindow) {
        newCache[pageNum] = pageCache[pageNum];
      }
    });
    
    setPageCache(newCache);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const currentPageData = pageCache[currentPage];

  if (loading) {
    return (
      <div className="ebook-reader-container">
        <div className="loading-screen">
          <Loader className="animate-spin w-8 h-8 mb-4" />
          <p>Loading ebook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ebook-reader-container">
        <div className="error-screen">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close Reader
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`ebook-reader-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header Controls */}
      <div className={`reader-header ${showControls ? 'visible' : 'hidden'}`}>
        <div className="header-left">
          <button onClick={onClose} className="control-button">
            <X size={20} />
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} className="control-button">
            <Menu size={20} />
          </button>
          <div className="ebook-title">
            <Book size={16} className="mr-2" />
            {metadata?.name}
          </div>
        </div>
        
        <div className="header-right">
          <button onClick={() => setDarkMode(!darkMode)} className="control-button">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={toggleFullscreen} className="control-button">
            Fullscreen
          </button>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="reader-sidebar">
          <div className="sidebar-content">
            <h3>Navigation</h3>
            <div className="page-jump">
              <label>Go to page:</label>
              <input 
                type="number" 
                min="1" 
                max={metadata?.totalPages || 1}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= (metadata?.totalPages || 1)) {
                    goToPage(page);
                  }
                }}
              />
            </div>
            
            <div className="ebook-info">
              <h4>Ebook Info</h4>
              <p>Pages: {metadata?.totalPages}</p>
              <p>Format: {metadata?.format?.toUpperCase()}</p>
              <p>Size: {ebooksService.formatFileSize(metadata?.size || 0)}</p>
              {metadata?.estimatedReadingTime && (
                <p>Reading time: {ebooksService.formatReadingTime(metadata.estimatedReadingTime)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="reader-content" ref={contentRef}>
        {pageLoading && (
          <div className="page-loading">
            <Loader className="animate-spin w-6 h-6" />
          </div>
        )}
        
        {currentPageData && (
          <div className="page-container" style={{ transform: `scale(${zoom})` }}>
            {currentPageData.contentType === 'image' ? (
              <img 
                src={currentPageData.content} 
                alt={`Page ${currentPage}`}
                className="page-image"
              />
            ) : (
              <div 
                className="page-html"
                dangerouslySetInnerHTML={{ __html: currentPageData.content }}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className={`reader-footer ${showControls ? 'visible' : 'hidden'}`}>
        <div className="navigation-controls">
          <button 
            onClick={previousPage} 
            disabled={currentPage <= 1}
            className="nav-button"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <div className="page-info">
            <span>{currentPage} of {metadata?.totalPages}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${metadata ? (currentPage / metadata.totalPages) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
          
          <button 
            onClick={nextPage} 
            disabled={currentPage >= (metadata?.totalPages || 1)}
            className="nav-button"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="zoom-controls">
          <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="control-button">
            <ZoomOut size={16} />
          </button>
          <span className="zoom-level">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="control-button">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom(1)} className="control-button">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;