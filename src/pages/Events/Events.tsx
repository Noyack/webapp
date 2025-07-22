// src/pages/Events/Events.tsx - Fix the filter error

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
  // Initialize events as empty array to prevent undefined errors
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('');
  const hasLoadedRef = useRef(false);
  const [fetching, setFetching] = useState<boolean>(false);

  // Load events from HubSpot
  useEffect(() => {
    const loadEvents = async () => {
      if (hasLoadedRef.current) return;
      
      try {
        setFetching(true);
        hasLoadedRef.current = true;
        
        console.log('Loading events from HubSpot...');
        const response = await hubspotService.getAllEvents();
        
        if (response && response.results) {
          // Transform HubSpot events to our Event interface
          const transformedEvents: Event[] = response.results.map((hubspotEvent: any) => ({
            id: hubspotEvent.id || hubspotEvent.objectId || Math.random().toString(),
            title: hubspotEvent.eventName || 'Unnamed Event',
            description: hubspotEvent.eventDescription || 'No description available',
            date: hubspotEvent.startDateTime ? hubspotEvent.startDateTime.split('T')[0] : new Date().toISOString().split('T')[0],
            time: hubspotEvent.startDateTime ? new Date(hubspotEvent.startDateTime).toLocaleTimeString() : '12:00 PM',
            location: hubspotEvent.eventUrl || 'Online',
            type: determineEventType(hubspotEvent.eventType || 'webinar'),
            status: determineEventStatus(hubspotEvent.startDateTime),
            imageUrl: hubspotEvent.eventUrl || Backdrop,
            videoUrl: hubspotEvent.eventUrl,
            registrationUrl: hubspotEvent.eventUrl,
            attendeeCount: hubspotEvent.registrants || 0,
            maxAttendees: hubspotEvent.registrants || 100,
            tags: hubspotEvent.customProperties ? Object.keys(hubspotEvent.customProperties) : ['webinar'],
            speaker: {
              name: hubspotEvent.eventOrganizer || 'Noyack Team',
              title: 'Financial Advisor',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
            }
          }));
          
          console.log('Transformed events:', transformedEvents);
          setEvents(transformedEvents);
        } else {
          console.log('No events found, using empty array');
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        // Set empty array on error to prevent undefined issues
        setEvents([]);
      } finally {
        setFetching(false);
      }
    };

    loadEvents();
  }, []);

  // Helper functions
  const determineEventType = (hubspotType: string): Event['type'] => {
    const typeMap: { [key: string]: Event['type'] } = {
      'webinar': 'webinar',
      'workshop': 'workshop',
      'masterclass': 'masterclass',
      'networking': 'networking',
      'conference': 'conference'
    };
    return typeMap[hubspotType.toLowerCase()] || 'webinar';
  };

  const determineEventStatus = (startDateTime: string): Event['status'] => {
    if (!startDateTime) return 'UPCOMING';
    const eventDate = new Date(startDateTime);
    const now = new Date();
    return eventDate < now ? 'PAST' : 'UPCOMING';
  };

  // Filter events based on status, type, and search
  useEffect(() => {
    // Always ensure events is an array before filtering
    if (!Array.isArray(events)) {
      console.warn('Events is not an array:', events);
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events]; // Create a copy to avoid mutations

    try {
      // Filter by tab (status)
      filtered = filtered.filter(event => {
        if (!event || !event.status) return false;
        return event.status === activeTab;
      });

      // Filter by type
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(event => {
          if (!event || !event.type) return false;
          return event.type === selectedFilter;
        });
      }

      // Filter by search term with null checks
      if (searchTerm && searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(event => {
          if (!event) return false;
          
          const title = (event.title || '').toLowerCase();
          const description = (event.description || '').toLowerCase();
          const tags = Array.isArray(event.tags) ? event.tags : [];
          
          return (
            title.includes(searchLower) ||
            description.includes(searchLower) ||
            tags.some(tag => (tag || '').toLowerCase().includes(searchLower))
          );
        });
      }

      console.log('Filtered events:', filtered.length, 'from', events.length, 'total events');
      setFilteredEvents(filtered);
    } catch (error) {
      console.error('Error filtering events:', error);
      setFilteredEvents([]);
    }
  }, [events, activeTab, selectedFilter, searchTerm]);

  // Rest of your component code (EventCard, Calendar, etc.)
  const EventCard = ({ event }: { event: Event }) => {
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

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return 'Invalid Date';
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={event.imageUrl || Backdrop} 
            alt={event.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = Backdrop;
            }}
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
          {event.status === 'live' && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{event.time}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {event.attendeeCount || 0}
                {event.maxAttendees && ` / ${event.maxAttendees}`}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {event.status === 'UPCOMING' && event.registrationUrl && (
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                Register
              </button>
            )}
            
            {event.status === 'PAST' && event.videoUrl && (
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Watch
              </button>
            )}
            
            <button 
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Noyack Events
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join our expert-led webinars, workshops, and networking events designed to enhance your financial knowledge and investment strategy.
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
            { 
              id: 'UPCOMING', 
              label: 'Upcoming Events', 
              count: Array.isArray(events) ? events.filter(e => e && e.status === 'UPCOMING').length : 0 
            },
            { 
              id: 'PAST', 
              label: 'Past Events', 
              count: Array.isArray(events) ? events.filter(e => e && e.status === 'PAST').length : 0 
            }
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
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.isArray(filteredEvents) && filteredEvents.map((event, i) => (
              <EventCard key={event?.id || i} event={event} />
            ))}
            
            {(!Array.isArray(filteredEvents) || filteredEvents.length === 0) && (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">
                  {!Array.isArray(events) || events.length === 0 
                    ? 'No events are currently available.' 
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Event Details</h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {selectedEvent.date} • {selectedEvent.time}
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
              
              {Array.isArray(selectedEvent.tags) && selectedEvent.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedEvent.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
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