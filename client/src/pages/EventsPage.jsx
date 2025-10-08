import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaUsers, FaCheckCircle } from 'react-icons/fa';

const highlightedEvents = [
  {
    id: 1,
    title: 'The Web Launchpad: An HTML Kickstart',
    description: 'Our comprehensive web development workshop introducing students to HTML fundamentals, modern web practices, and hands-on coding experience.',
    date: 'September 2023',
    location: 'DCAC Auditorium',
    participants: '100+ Participants',
    status: 'COMPLETED',
    image: '/workshop on html.jpeg',
    category: 'Workshop'
  },
  {
    id: 2,
    title: 'Introduction to AI',
    description: 'Expert sessions on artificial intelligence fundamentals and generative AI technologies, featuring industry professionals and academic experts.',
    date: 'October 2024',
    location: 'DCAC Lab-2',
    participants: '30+ Participants',
    status: 'COMPLETED',
    image: '/Guest Lecture/into to ai.jpeg',
    category: 'Guest Lecture'
  },
  {
    id: 3,
    title: 'Adieu 25 - Farewell Event',
    description: 'Memorable farewell celebration for graduating members of ByteZen.',
    date: 'March 2025',
    location: 'DCAC Auditorium',
    participants: '50+ Participants',
    status: 'COMPLETED',
    image: '/Adieu 25/farewell.jpeg',
    category: 'Social Event'
  }
];

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-[#2f8d46] hover:text-[#267a3a] mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Tech Community Activities</h1>
          <p className="text-xl text-gray-600">
            Join our exciting tech events, workshops, and hackathons
          </p>
        </div>

        {/* Highlighted Events */}
        <div className="space-y-8">
          {highlightedEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                {/* Event Image */}
                <div className="md:w-2/5 h-64 md:h-auto">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/hero img.webp';
                    }}
                  />
                </div>

                {/* Event Details */}
                <div className="md:w-3/5 p-6 md:p-8">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-1" />
                      {event.status}
                    </span>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {event.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-700">
                      <FaCalendar className="text-[#2f8d46] mr-2 flex-shrink-0" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="text-[#2f8d46] mr-2 flex-shrink-0" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaUsers className="text-[#2f8d46] mr-2 flex-shrink-0" />
                      <span className="text-sm">{event.participants}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-[#2f8d46] to-[#267a3a] rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">More Events Coming Soon!</h3>
          <p className="text-lg opacity-90">
            Stay tuned for upcoming workshops, hackathons, and tech talks. Follow us for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
