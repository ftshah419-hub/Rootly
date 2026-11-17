import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { getProduceMarkerIcon } from './MapMarker.jsx';

// Internal click handler component for React-Leaflet
const LocationMarkerPicker = ({ position, onLocationChange }) => {
  useMapEvents({
    click(e) {
      // Leaflet gives { lat, lng }
      onLocationChange([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? (
    <Marker
      position={position}
      icon={getProduceMarkerIcon('SELL')}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const latLng = marker.getLatLng();
          onLocationChange([latLng.lat, latLng.lng]);
        }
      }}
    />
  ) : null;
};

export const LocationPicker = ({
  initialGeoJSON = [76.2711, 10.8505], // [longitude, latitude]
  onSelectGeoJSON,
  height = '300px'
}) => {
  // Convert GeoJSON [lon, lat] -> Leaflet [lat, lon]
  const [leafletCoords, setLeafletCoords] = useState([
    initialGeoJSON[1],
    initialGeoJSON[0]
  ]);

  const handleLocationUpdate = (coords) => {
    setLeafletCoords(coords);
    // Convert Leaflet [lat, lon] -> GeoJSON [lon, lat]
    if (onSelectGeoJSON) {
      onSelectGeoJSON([coords[1], coords[0]]);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-sand dark:border-darkborder shadow-warm">
      <div className="p-2.5 bg-cream dark:bg-darkcard text-xs text-earth dark:text-cream/80 flex items-center justify-between border-b border-sand/60 dark:border-darkborder">
        <span>📍 Click or drag pin to choose approximate garden area:</span>
        <span className="font-mono text-[11px] text-olive-800 dark:text-sand">
          {leafletCoords[0].toFixed(4)}, {leafletCoords[1].toFixed(4)}
        </span>
      </div>
      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={leafletCoords}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarkerPicker
            position={leafletCoords}
            onLocationChange={handleLocationUpdate}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
