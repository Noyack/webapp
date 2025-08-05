import React, { useState } from 'react';
import { Download, Mail, ArrowRight } from 'lucide-react';

const Ebook = () => {
  const [email, setEmail] = useState('');

  // Sample ebook data - you can replace with your actual ebooks
  const ebooks = [
    {
      id: 1,
      title: "50 Years of Warren Buffett Wisdom",
      author: "NOYACK",
      description: "The Ultimate Tax Optimization Checklist",
      subtitle: "Discover essential strategies to maximize your wealth through smart tax planning.",
      image: "/api/placeholder/280/200",
      downloadLink: "#",
      bgColor: "bg-blue-900"
    },
    {
      id: 2,
      title: "Your Debt-Free Strategy Roadmap",
      author: "NOYACK", 
      description: "Here's your guide to the ultimate year-end checklist",
      subtitle: "Learn proven methods to eliminate debt efficiently.",
      image: "/api/placeholder/280/200",
      downloadLink: "#",
      bgColor: "bg-blue-800"
    },
    {
      id: 3,
      title: "50 Years of Warren Buffett Wisdom",
      author: "NOYACK",
      description: "How FIRE is Rethinking Retirement in America", 
      subtitle: "Understand how the retirement number builds profit in both rewards and costs.",
      image: "/api/placeholder/280/200",
      downloadLink: "#",
      bgColor: "bg-blue-900"
    },
    {
      id: 4,
      title: "Reconstructing & Building A Family Planning Guide",
      author: "NOYACK",
      description: "Here's your guide to the ultimate year-end checklist",
      subtitle: "Comprehensive guidance for raising kids, buying homes, and planning for college.",
      image: "/api/placeholder/280/200", 
      downloadLink: "#",
      bgColor: "bg-blue-800"
    },
    
  ];

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

  return (
    <div className=" min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">EBOOKS & GUIDES</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Downloadable, straightforward wealth guides from finance pros.
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Ebooks Grid */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-6">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="max-w-[290px] rounded-xl  overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Ebook Cover */}
                  <div className={`${ebook.bgColor} p-6 relative h-80 flex items-center justify-center`}>
                    <div className="text-center">
                      <h3 className="text-white text-lg font-bold mb-2">{ebook.title}</h3>
                      <div className="bg-white/20 rounded px-3 py-1 text-white text-sm">
                        {ebook.author}
                      </div>
                    </div>
                    {/* Sample image placeholder - you can replace with actual book covers */}
                    <div className="absolute top-4 right-4 w-16 h-20 bg-white/10 rounded border border-white/20"></div>
                  </div>

                  {/* Ebook Details */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">{ebook.description}</h4>
                    <p className="text-gray-600 text-sm mb-4">{ebook.subtitle}</p>
                    
                    <button 
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors"
                      onClick={() => window.open(ebook.downloadLink, '_blank')}
                    >
                      Read <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ebook;