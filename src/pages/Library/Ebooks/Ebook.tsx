import React, { useState, useEffect } from 'react';
import { Download, Mail, ArrowRight, Loader } from 'lucide-react';
import ebooksService, { Ebook as EbookType } from '../../../services/ebooks.service';

const Ebook = () => {
  const [email, setEmail] = useState('');
  const [ebooks, setEbooks] = useState<EbookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Color options for ebook covers
  const colorOptions = [
    "bg-blue-900",
    "bg-blue-800", 
    "bg-indigo-900",
    "bg-purple-900",
    "bg-slate-800",
    "bg-gray-800"
  ];

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedEbooks = await ebooksService.getAllEbooks();
      setEbooks(fetchedEbooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ebooks');
      console.error('Error fetching ebooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    console.log('Email submitted:', email);
    // Handle email submission logic here
    setEmail('');
    alert('Thank you! Check your email for the download link.');
  };

  const handleDownload = async (ebook: EbookType, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setDownloading(ebook.id);
    
    try {
      await ebooksService.downloadEbook(ebook.id, ebook.name);
    } catch (err) {
      alert(`Failed to download ${ebook.name}`);
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    return ebooksService.formatFileSize(bytes);
  };

  const getFileIcon = (extension: string) => {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'epub':
        return '📖';
      case 'mobi':
      case 'azw':
      case 'azw3':
        return '📚';
      default:
        return '📄';
    }
  };

  // Generate a clean title and description from the ebook name
  const generateEbookDetails = (name: string) => {
    // Remove file extension and clean up the name
    const cleanName = name.replace(/\.(pdf|epub|mobi|azw3?|doc|docx)$/i, '');
    
    // Split by common separators and take the first part as title
    const parts = cleanName.split(/[-_\s]+/);
    const title = parts.slice(0, 3).join(' ');
    
    return {
      title: cleanName,
      description: `Comprehensive guide and insights on ${title.toLowerCase()}`,
      subtitle: "Expert knowledge and strategies to enhance your understanding."
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">EBOOKS & GUIDES</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Downloadable, straightforward wealth guides from finance pros.
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
              <p className="text-gray-600">Loading ebooks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">EBOOKS & GUIDES</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Downloadable, straightforward wealth guides from finance pros.
            </h2>
          </div>
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchEbooks}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">EBOOKS & GUIDES</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Downloadable, straightforward wealth guides from finance pros.
          </h2>
          <p className="text-gray-600 mt-2">
            {ebooks.length} ebook{ebooks.length !== 1 ? 's' : ''} available for download
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ebooks Grid */}
          <div className="flex-1">
            {ebooks.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg mb-4">No ebooks available at the moment.</p>
                <button 
                  onClick={fetchEbooks}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6">
                {ebooks.map((ebook, index) => {
                  const details = generateEbookDetails(ebook.name);
                  const bgColor = colorOptions[index % colorOptions.length];
                  
                  return (
                    <div key={ebook.id} className="max-w-[290px] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Ebook Cover */}
                      <div className={`${bgColor} p-6 relative h-80 flex items-center justify-center`}>
                        <div className="text-center">
                          <h3 className="text-white text-lg font-bold mb-2 line-clamp-3">
                            {details.title}
                          </h3>
                          <div className="bg-white/20 rounded px-3 py-1 text-white text-sm mb-2">
                            NOYACK
                          </div>
                          <div className="text-white/80 text-xs">
                            {getFileIcon(ebook.extension)} {ebook.extension.toUpperCase()} • {formatFileSize(ebook.size)}
                          </div>
                        </div>
                        {/* File type indicator */}
                        <div className="absolute top-4 right-4 w-16 h-20 bg-white/10 rounded border border-white/20 flex items-center justify-center text-white text-2xl">
                          {getFileIcon(ebook.extension)}
                        </div>
                      </div>

                      {/* Ebook Details */}
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-800 mb-2">{details.description}</h4>
                        <p className="text-gray-600 text-sm mb-4">{details.subtitle}</p>
                        
                        <div className="flex items-center justify-between">
                          <button 
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={(e) => handleDownload(ebook, e)}
                            disabled={downloading === ebook.id}
                          >
                            {downloading === ebook.id ? (
                              <>
                                <Loader className="animate-spin" size={16} />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download size={16} />
                                Download
                              </>
                            )}
                          </button>
                          
                          <div className="text-xs text-gray-500">
                            Added: {new Date(ebook.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ebook;