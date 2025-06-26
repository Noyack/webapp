import { useState, useRef, useEffect } from "react";
import Logo from '../../assets/N-Transparent-Background.png';

export const DashboardSearch = () => {
  const [query, setQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", query);
    
    // If there's an iframe loaded, you could potentially send the query to it
    if (iframeRef.current && isPopoverOpen) {
      try {
        // Example of communicating with the iframe - adjust based on your iframe's API
        iframeRef.current.contentWindow?.postMessage({
          type: 'SEARCH_QUERY',
          query: query
        }, '*');
      } catch (error) {
        console.error("Failed to communicate with iframe:", error);
      }
    }
  };

  const openPopover = () => {
    setIsAnimating(true);
    setIsPopoverOpen(true);
  };

  const closePopover = () => {
    setIsAnimating(true);
    setIsPopoverOpen(false);
  };

  // Handle animation end
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    };

    // Close on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPopoverOpen) {
        closePopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isPopoverOpen]);

  // Prevent body scrolling when popover is open
  useEffect(() => {
    if (isPopoverOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPopoverOpen]);

  return (
    <div className="w-3/4 max-w-2xl relative">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <img src={Logo} className="w-6 h-6" alt="Noyack Logo" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={openPopover}
          placeholder="Ask me anything about Financial Wealth"
          className="w-full pl-15 pr-6 py-4 rounded-full border
          bg-white shadow-lg
          border-gray-200 focus:border-green-500 focus:ring-1
          focus:ring-green-500 placeholder-gray-400 text-gray-700 transition-all"
          aria-expanded={isPopoverOpen}
          aria-controls="search-popover"
        />
      </form>

      {/* Popover */}
      {(isPopoverOpen || isAnimating) && (
        <div 
          id="search-popover"
          ref={popoverRef}
          className={`absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden 
            transition-all duration-300 ease-in-out
            ${isPopoverOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
          style={{ 
            maxWidth: "calc(100vw - 40px)",
            transformOrigin: "top center",
            maxHeight: "calc(100vh - 150px)"
          }}
          onTransitionEnd={handleAnimationEnd}
          role="dialog"
          aria-label="Search Assistant"
        >
          <div className="relative p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">Noyack Copilot</h3>
              <button 
                onClick={closePopover}
                className="bg-gray-200 hover:bg-gray-300 rounded-full p-1.5 transition-colors"
                aria-label="Close popover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div 
              className="iframe-container" 
              style={{ 
                borderRadius: "12px", 
                overflow: "hidden",
                position: "relative"
              }}
            >
              {/* <iframe 
                ref={iframeRef}
                src="https://noyack-copilot.kindrock-2260a423.eastus.azurecontainerapps.io/" 
                width="100%" 
                height="600" 
                style={{ 
                  borderRadius: "12px",
                  border: "none"
                }}
                title="Noyack Copilot"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              ></iframe> */}
              
              {/* Loading overlay - optional */}
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 transition-opacity duration-300" style={{ display: "none" }}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSearch;