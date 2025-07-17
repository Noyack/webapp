import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Play, ExternalLink, Filter, Search, Share, BookmarkPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import Backdrop from '../../assets/NOYACK Logo transparent background .png'
import hubspotService from '../../services/hubspot.service';
import LoadingSpinner from '../../components/UI/Loader';

// Types for our events and social media
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'webinar' | 'workshop' | 'masterclass' | 'networking' | 'conference';
  status: 'UPCOMING' | 'PAST' | 'live';
  imageUrl: string;
  videoUrl?: string;
  registrationUrl?: string;
  attendeeCount?: number;
  maxAttendees?: number;
  tags: string[];
  speaker?: {
    name: string;
    title: string;
    imageUrl: string;
  };
}

interface SocialPost {
  id: string;
  platform: 'linkedin' | 'twitter';
  content: string;
  author: string;
  authorImage: string;
  date: string;
  likes: number;
  shares: number;
  url: string;
  mediaUrl?: string;
}

// Mock data - replace with actual HubSpot/API calls


const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'linkedin',
    content: 'Great insights from our latest investment webinar! The discussion on ESG investing was particularly enlightening. Looking forward to implementing these strategies.',
    author: 'Jennifer Walsh',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50',
    date: '2025-01-20',
    likes: 45,
    shares: 12,
    url: '#'
  },
  {
    id: '2',
    platform: 'twitter',
    content: 'Just attended @NoyackWealth webinar on retirement planning. Mind = blown 🤯 The FIRE calculator they shared is a game changer! #FinancialPlanning #FIRE',
    author: 'Alex Thompson',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50',
    date: '2025-01-19',
    likes: 23,
    shares: 8,
    url: '#'
  },
  {
    id: '3',
    platform: 'linkedin',
    content: 'The networking session after the Noyack wealth management workshop was incredible. Connected with so many like-minded investors!',
    author: 'Maria Garcia',
    authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b742?w=50',
    date: '2025-01-18',
    likes: 67,
    shares: 15,
    url: '#'
  }
];

const EventsPage = () => {
  const [events, setEvents ] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('');
  const hasLoadedRef = useRef(false);
  const [ fetching, setFetching ] = useState<boolean>(false)

  // Filter events based on status, type, and search
  useEffect(() => {
  let filtered = events;

  // Filter by tab (status)
  filtered = filtered.filter(event => event.status === activeTab);

  // Filter by type
  if (selectedFilter !== 'all') {
    filtered = filtered.filter(event => event.type === selectedFilter);
  }

  // Filter by search term with null checks
  if (searchTerm) {
    filtered = filtered.filter(event => {
      const title = event.title || ''; // Default to empty string if null/undefined
      const description = event.description || ''; // Default to empty string if null/undefined
      const tags = event.tags || []; // Default to empty array if null/undefined
      
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tags.some(tag => (tag || '').toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }

  setFilteredEvents(filtered);
}, [events, activeTab, selectedFilter, searchTerm]);

  // Mock API call to fetch events from HubSpot
  useEffect(() => {
    const fetchEventsFromHubSpot = async () => {
      setFetching(()=>true)
      if (hasLoadedRef.current) return;
      
      try {
        await hubspotService.getAllEvents().then((res)=> {
          setEvents(()=>res.response)
          setFetching(()=>false)
        })
        // This would be your actual HubSpot API call
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Error fetching events from HubSpot:', error);
      }
    };

    fetchEventsFromHubSpot();
  }, []);

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      webinar: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      masterclass: 'bg-purple-100 text-purple-800',
      networking: 'bg-orange-100 text-orange-800',
      conference: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (dateStr: string) => {
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventsOnDate = getEventsForDate(dateStr);
    
    if (eventsOnDate.length > 0) {
      setSelectedDateEvents(eventsOnDate);
      setSelectedCalendarDate(dateStr);
      setShowDatePopup(true);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day names header
    const dayHeaders = dayNames.map(day => (
      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
        {day}
      </div>
    ));

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const eventsOnDate = getEventsForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 flex items-center justify-center text-sm relative cursor-pointer hover:bg-gray-100 rounded ${
            isToday ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-700'
          } ${eventsOnDate.length > 0 ? 'font-medium' : ''}`}
        >
          {day}
          {eventsOnDate.length > 0 && (
            <div className="absolute bottom-0 right-1 flex gap-0.5">
              {eventsOnDate.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.type === 'webinar' ? 'bg-blue-500' :
                    event.type === 'workshop' ? 'bg-green-500' :
                    event.type === 'masterclass' ? 'bg-purple-500' :
                    event.type === 'networking' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                />
              ))}
              {eventsOnDate.length > 3 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayHeaders}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </>
    );
  };

  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={Backdrop} 
          alt={event.title}
          className="w-full h-48 object-contain"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        {event.status === 'PAST' && event.videoUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-200">
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(event.date)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{event.time}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{event.location}</span>
        </div>
        
        {/* {event.speaker && (
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={event.speaker.imageUrl} 
              alt={event.speaker.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{event.speaker.name}</p>
              <p className="text-xs text-gray-600">{event.speaker.title}</p>
            </div>
          </div>
        )} */}
        
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div> */}
        
        <div className="flex items-center justify-between">
          {/* {event.status === 'upcoming' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{event.attendeeCount}/{event.maxAttendees} registered</span>
            </div>
          )} */}
          
          {event.status === 'PAST' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{event.attendeeCount} attended</span>
            </div>
          )}
          
          <button 
            onClick={() => openEventModal(event)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {event.status === 'UPCOMING' ? 'Register' : 'View Details'}
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const SocialFeed = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Share className="w-5 h-5" />
        Social Media Buzz
      </h3>
      
      <div className="space-y-4">
        {mockSocialPosts.map((post) => (
          <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <div className="flex items-start gap-3">
              <img 
                src={post.authorImage} 
                alt={post.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">{post.author}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <div className={`w-4 h-4 rounded ${post.platform === 'linkedin' ? 'bg-blue-600' : 'bg-sky-500'}`}>
                    {post.platform === 'linkedin' ? (
                      <span className="text-white text-xs font-bold flex items-center justify-center h-full">in</span>
                    ) : (
                      <span className="text-white text-xs font-bold flex items-center justify-center h-full">X</span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3">{post.content}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span>❤️</span>
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>🔄</span>
                    {post.shares}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-green-600 hover:text-green-700 font-medium">
        Load more posts
      </button>
    </div>
  );

  if(fetching)
    return(<LoadingSpinner />)
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Events & Learning</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our expert-led events, workshops, and masterclasses to enhance your financial knowledge and connect with fellow investors.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="webinar">Webinars</option>
              <option value="workshop">Workshops</option>
              <option value="masterclass">Masterclasses</option>
              <option value="networking">Networking</option>
              <option value="conference">Conferences</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'UPCOMING', label: 'Upcoming Events', count: events.filter(e => e.status === 'UPCOMING').length },
            { id: 'PAST', label: 'Past Events', count: events.filter(e => e.status === 'PAST').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.map((event,i) => (
              <EventCard key={i} event={event} />
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calendar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {renderCalendar()}
            
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Webinar</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Workshop</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Masterclass</span>
              </div>
            </div>
          </div>

          {/* Social Feed */}
          <SocialFeed />
        </div>
      </div>

      {/* Date Events Popup */}
      {showDatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Events on {formatDate(selectedCalendarDate)}
                </h3>
                <button 
                  onClick={() => setShowDatePopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 cursor-pointer"
                       onClick={() => {
                         setShowDatePopup(false);
                         openEventModal(event);
                       }}>
                    <div className="flex items-start gap-3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{event.time} • {event.location}</p>
                        <span className={`px-2 py-1 rounded text-xs ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
              />
              <button 
                onClick={closeEventModal}
                className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {formatDate(selectedEvent.date)} • {selectedEvent.time}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>
              
              <p className="text-gray-700 mb-6">{selectedEvent.description}</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
                
                {selectedEvent.speaker && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedEvent.speaker.imageUrl} 
                      alt={selectedEvent.speaker.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedEvent.speaker.name}</p>
                      <p className="text-sm text-gray-600">{selectedEvent.speaker.title}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>
                    {selectedEvent.status === 'UPCOMING' 
                      ? `${selectedEvent.attendeeCount}/${selectedEvent.maxAttendees} registered`
                      : `${selectedEvent.attendeeCount} attended`
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedEvent.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-3">
                {selectedEvent.status === 'UPCOMING' && selectedEvent.registrationUrl && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium">
                    Register Now
                  </button>
                )}
                
                {selectedEvent.status === 'PAST' && selectedEvent.videoUrl && (
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Recording
                  </button>
                )}
                
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <BookmarkPlus className="w-5 h-5" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;