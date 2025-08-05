// src/pages/Library/Ebooks/Ebook.tsx
import React, { useState, useEffect } from 'react';
import { Book, ArrowRight, Loader, Search, BookOpen } from 'lucide-react';
import ebooksService, { Ebook as EbookType } from '../../../services/ebooks.service';
import EbookReader from '../../../components/EbookReader/EbookReader';

const Ebook = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ebooks, setEbooks] = useState<EbookType[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<EbookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEbookId, setSelectedEbookId] = useState<string | null>(null);

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

  useEffect(() => {
    filterEbooks();
  }, [searchTerm, ebooks]);

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

  const filterEbooks = () => {
    if (!searchTerm.trim()) {
      setFilteredEbooks(ebooks);
    } else {
      const filtered = ebooks.filter(ebook =>
        ebook.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEbooks(filtered);
    }
  };

  const handleReadEbook = (ebookId: string) => {
    setSelectedEbookId(ebookId);
  };

  const handleCloseReader = () => {
    setSelectedEbookId(null);
  };

  const formatFileSize = (bytes: number): string => {
    return ebooksService.formatFileSize(bytes);
  };

  const getFileIcon = (extension: string) => {
    return ebooksService.getFileIcon(extension);
  };

  // Generate a clean title and description from the ebook name
  const generateEbookDetails = (name: string) => {
    return ebooksService.generateEbookDetails(name);
  };

  // If reader is open, show only the reader
  if (selectedEbookId) {
    return (
      <EbookReader 
        ebookId={selectedEbookId} 
        onClose={handleCloseReader}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 Digital Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of ebooks and resources. Read directly in your browser with our interactive reader.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ebooks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin w-8 h-8 text-blue-600 mr-3" />
            <span className="text-gray-600">Loading ebooks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-red-800">Error loading ebooks</h3>
                <p className="text-red-600 mt-1">{error}</p>
                <button 
                  onClick={fetchEbooks}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ebooks Grid */}
        {!loading && !error && (
          <>
            {filteredEbooks.length === 0 ? (
              <div className="text-center py-12">
                <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No ebooks found' : 'No ebooks available'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for new additions.'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <p className="text-gray-600">
                    {searchTerm ? `Found ${filteredEbooks.length} ebook(s) for "${searchTerm}"` : `${filteredEbooks.length} ebooks available`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredEbooks.map((ebook, index) => {
                    const details = generateEbookDetails(ebook.name);
                    const colorClass = colorOptions[index % colorOptions.length];
                    
                    return (
                      <div key={ebook.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        {/* Ebook Cover */}
                        <div className={`${colorClass} h-48 flex flex-col justify-between p-6 text-white relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                          <div className="relative z-10">
                            <div className="text-3xl mb-2">{getFileIcon(ebook.extension)}</div>
                            <h3 className="font-bold text-lg leading-tight line-clamp-2">
                              {details.title}
                            </h3>
                          </div>
                          <div className="relative z-10">
                            <span className="inline-block bg-white/20 px-2 py-1 rounded text-xs font-medium uppercase">
                              {ebook.extension?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Ebook Details */}
                        <div className="p-6">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {details.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <span>Size: {formatFileSize(ebook.size)}</span>
                            <span className={`px-2 py-1 rounded-full ${ebook.isReadable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {ebook.isReadable ? 'Readable' : 'View Only'}
                            </span>
                          </div>
                          
                          {/* Read Button */}
                          {ebook.isReadable ? (
                            <button
                              onClick={() => handleReadEbook(ebook.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center group-hover:scale-105"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Read Now
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed"
                            >
                              Format Not Supported
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Ebook;