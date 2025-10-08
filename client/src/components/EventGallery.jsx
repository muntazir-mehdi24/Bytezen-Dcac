import React from 'react';
import PropTypes from 'prop-types';

const EventGallery = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No events to display</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">Event Gallery</h1>
      
      <div className="space-y-16">
        {events.map((event, eventIndex) => (
          <section key={eventIndex} className="mb-16">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
              {event.name}
            </h2>
            
            {event.description && (
              <p className="text-gray-600 mb-6 max-w-3xl">
                {event.description}
              </p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.images && event.images.map((image, imgIndex) => (
                <div 
                  key={imgIndex}
                  className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={image}
                    alt={`${event.name} - ${imgIndex + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

EventGallery.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
};

export default EventGallery;
