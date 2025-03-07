import { useState } from 'react';
import { ChevronLeft, ChevronRight, LocationOnOutlined, CalendarTodayOutlined } from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';


interface EventItem {
  date: string;
  time: string;
  location: string;
  description: string;
}

export const UpcomingEvents = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const events: EventItem[] = [
    {
      date: "Mon, April 8",
      time: "5:00pm - 8:00pm PDT",
      location: "Lake Crescent Lodge",
      description: "Investment strategy meeting with portfolio managers"
    },
    {
      date: "Tue, April 9",
      time: "6:00pm - 9:00pm PDT",
      location: "Mountain View Campus",
      description: "Annual investor conference"
    },
  ];

  const handlePrev = () => {
    setCurrentEventIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentEventIndex(prev => Math.min(events.length - 1, prev + 1));
  };

  const totalEvents = events.length;
  const maxDots = 5;
  const current = currentEventIndex;
  
  // Calculate visible dot range
  let start = Math.max(0, current - Math.floor(maxDots/2));
  const end = Math.min(start + maxDots - 1, totalEvents - 1);
  
  // Adjust if we're at the end
  if (end === totalEvents - 1) {
    start = Math.max(0, end - maxDots + 1);
  }

  return (
    <AnimatePresence mode='wait'>

    <div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm p-8 pb-2">
      <h3 className="text-smd font-semibold">Upcoming Events</h3>
      
      <div className="relative">
  <motion.div
    key={currentEventIndex}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    transition={{ duration: 0.2 }}
  >
        {/* Navigation Arrows */}
        {/* Event Display */}
        <div className="">
          <div className="flex flex-col gap-3 transition-opacity duration-300">
            {/* Date with centered arrows */}
            <div className="flex items-center justify-center gap-2">
              <ChevronLeft 
                fontSize="small" 
                className={`cursor-pointer ${
                  currentEventIndex === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-primary'
                }`}
                onClick={handlePrev}
              />
              <p className="font-medium text-gray-900 text-center">
                {events[currentEventIndex].date}
              </p>
              <ChevronRight 
                fontSize="small" 
                className={`cursor-pointer ${
                  currentEventIndex === events.length - 1 ? 'text-gray-200' : 'text-gray-400 hover:text-primary'
                }`}
                onClick={handleNext}
              />
            </div>

            {/* Event Details */}
            <div className="flex gap-1 items-start">
              <LocationOnOutlined color="primary" fontSize="small" />
              <p className="text-sm text-gray-500">
                {events[currentEventIndex].time}
              </p>
            </div>

            <div className="flex gap-1 items-start">
              <CalendarTodayOutlined color="primary" fontSize="small" />
              <div>
                <h4 className="font-bold text-sm text-gray-900">
                  {events[currentEventIndex].location}
                </h4>
                <p className="text-[12px] text-gray-500">
                  {events[currentEventIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1 mt-2">
      {
        Array.from({ length: end - start + 1 }, (_, i) => start + i).map((index) => (

        <div 
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentEventIndex ? 'bg-green-900' : 'bg-gray-200'
          }`}
          />
          ))};
        </div>
    </div>
    </AnimatePresence>
  );
};