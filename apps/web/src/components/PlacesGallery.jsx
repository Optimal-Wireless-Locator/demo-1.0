import React from 'react';
import { motion } from 'framer-motion';
import PlaceVisualization from './PlaceVisualization';

function PlacesGallery({ places, tagLocations = [], onPlaceFullscreen }) {
  if (!places || places.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum place encontrado para visualizar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place, index) => (
        <motion.div
          key={place.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PlaceVisualization 
            place={place} 
            tagLocations={tagLocations}
            onFullscreen={() => onPlaceFullscreen && onPlaceFullscreen(place)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default PlacesGallery;