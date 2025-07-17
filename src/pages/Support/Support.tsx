import React, { useState } from 'react';

const supportCategories = [
  { 
    id: 'investments', 
    label: 'Investments & Portfolio', 
    icon: '📈',
    subcategories: ['Fund Selection', 'Portfolio Performance', 'Investment Strategy', 'Account Management', 'Transactions']
  },
  { 
    id: 'academy', 
    label: 'Academy & Education', 
    icon: '🎓',
    subcategories: ['Course Access', 'Learning Materials', 'Certificates', 'Progress Tracking', 'Content Issues']
  },
  { 
    id: 'calculators', 
    label: 'Financial Calculators', 
    icon: '🧮',
    subcategories: ['Retirement Planning', 'FIRE Calculator', 'Tax Optimization', 'Mortgage Calculator', 'Debt Payoff']
  },
  { 
    id: 'events', 
    label: 'Events & Webinars', 
    icon: '📅',
    subcategories: ['Event Registration', 'Event Access', 'Recordings', 'Scheduling', 'Technical Issues']
  },
  { 
    id: 'resources', 
    label: 'Resources & Reports', 
    icon: '📚',
    subcategories: ['E-books', 'Investment Reports', 'Newsletter', 'Research Reports', 'Market Updates']
  },
  { 
    id: 'technical', 
    label: 'Technical Support', 
    icon: '⚙️',
    subcategories: ['Login Issues', 'App Performance', 'Data Sync', 'Mobile App', 'Browser Issues']
  },
  { 
    id: 'account', 
    label: 'Account & Billing', 
    icon: '👤',
    subcategories: ['Profile Settings', 'Subscription', 'Billing Issues', 'Data Privacy', 'Account Security']
  }
];

const priorityLevels = [
  { value: 'low', label: 'Low - General inquiry', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium - Issue affecting usage', color: 'bg-orange-500' },
  { value: 'high', label: 'High - Urgent issue', color: 'bg-red-500' }
];

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: "How do I get started with investing?",
        a: "Begin by completing your Wealth Profile, which helps us understand your financial situation and goals. Then explore our educational content in the Academy section before making your first investment."
      },
      {
        q: "What types of investment funds do you offer?",
        a: "We offer a curated selection of funds focused on sustainable growth and income generation. Visit the Invest section to view current offerings and their performance metrics."
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: "Why can't I access my account?",
        a: "Check your internet connection and try clearing your browser cache. If issues persist, use the 'Forgot Password' feature or contact our technical support team."
      },
      {
        q: "How do I sync my financial data?",
        a: "Go to Wealth Profile > Connected Accounts to link your bank accounts and investment accounts through our secure Plaid integration."
      }
    ]
  }
];

const Support = () => {
  // Mock user ID - in your app you'd get this from your auth context
  const mockUserId = 'user-12345';
  
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    priority: 'medium',
    subject: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId,
      subcategory: '' // Reset subcategory when category changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In your actual app, you'd check if user is authenticated
    if (!mockUserId) {
      setError('Please log in to submit a support request');
      return;
    }

    setLoading(true);
    setError('');

    const supportTicket = {
      userId: mockUserId,
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'open'
    };

    try {
      // Replace with your actual API call
      const response = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(supportTicket)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          category: '',
          subcategory: '',
          priority: 'medium',
          subject: '',
          description: ''
        });
      } else {
        throw new Error('Failed to submit support request');
      }
    } catch (err) {
      setError('Failed to submit your request. Please try again.');
      console.error('Support submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = supportCategories.find(cat => cat.id === formData.category);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          How can we help you?
        </h1>
        <p className="text-xl text-gray-600">
          Get support for investments, education, tools, and more
        </p>
      </div>

      {/* Quick Contact Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📧</div>
            <h3 className="text-lg font-semibold">Email Support</h3>
            <p className="text-gray-600">support@noyack.com</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⏱️</div>
            <h3 className="text-lg font-semibold">Response Time</h3>
            <p className="text-gray-600">Within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📞</div>
            <h3 className="text-lg font-semibold">Phone Support</h3>
            <p className="text-gray-600">1-800-NOYACK</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Support Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Submit a Support Request</h2>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
                <span className="block sm:inline">Your support request has been submitted successfully! We'll get back to you within 24 hours.</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button onClick={() => setSuccess(false)} className="text-green-500 hover:text-green-700">
                    <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <title>Close</title>
                      <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.935a1 1 0 01-1.414-1.414l2.93-2.935-2.93-2.935a1 1 0 111.414-1.414L10 8.586l2.93-2.935a1 1 0 011.414 1.414L11.414 10l2.935 2.93a1 1 0 010 1.414z"/>
                    </svg>
                  </button>
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                <span className="block sm:inline">{error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
                    <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <title>Close</title>
                      <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.935a1 1 0 01-1.414-1.414l2.93-2.935-2.93-2.935a1 1 0 111.414-1.414L10 8.586l2.93-2.935a1 1 0 011.414 1.414L11.414 10l2.935 2.93a1 1 0 010 1.414z"/>
                    </svg>
                  </button>
                </span>
              </div>
            )}

            <div onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  What do you need help with?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {supportCategories.map((category) => (
                    <div 
                      key={category.id}
                      className={`cursor-pointer transition-all hover:shadow-md rounded-lg border-2 p-4 text-center ${
                        formData.category === category.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <p className="text-sm font-medium">{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subcategory */}
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Topic
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a specific topic...</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {priorityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Please provide as much detail as possible about your issue or question..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.category || !formData.subject || !formData.description}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Support Request'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            
            {faqs.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium text-green-600 mb-3">
                  {section.category}
                </h3>
                
                {section.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="mb-3">
                    <button
                      className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex justify-between items-center"
                      onClick={() => setExpandedFaq(expandedFaq === `${index}-${faqIndex}` ? null : `${index}-${faqIndex}`)}
                    >
                      <span className="text-sm font-medium pr-2">{faq.q}</span>
                      <svg 
                        className={`w-5 h-5 transform transition-transform ${expandedFaq === `${index}-${faqIndex}` ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === `${index}-${faqIndex}` && (
                      <div className="p-3 bg-white rounded-b-lg border-t border-gray-200">
                        <p className="text-sm text-gray-600">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Need immediate help?</strong> Check out our comprehensive help documentation in the Academy section or search our knowledge base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
