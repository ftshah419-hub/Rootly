import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getProduceMarkerIcon } from './MapMarker.jsx';
import UserLocationMarker from './UserLocationMarker.jsx';
import MapPopup from './MapPopup.jsx';
import MapControls from './MapControls.jsx';

// Map re-centering helper
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const MapView = ({
  items = [],
  userLocation = [10.8505, 76.2711], // Default [latitude, longitude] Leaflet order
  radiusKm = 5,
  onRadiusChange,
  onSelectItem,
  height = '500px'
}) => {
  const [center, setCenter] = useState(userLocation);
  const [exchangeFilter, setExchangeFilter] = useState('ALL');
  const [isLocating, setIsLocating] = useState(false);

  // Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = [pos.coords.latitude, pos.coords.longitude];
        setCenter(newCoords);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation notice:', err.message);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    if (exchangeFilter === 'ALL') return true;
    return item.exchangeType === exchangeFilter;
  });

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-sand dark:border-darkborder shadow-warm">
      {/* Controls Overlay */}
      <MapControls
        radiusKm={radiusKm}
        onRadiusChange={onRadiusChange}
        exchangeFilter={exchangeFilter}
        onExchangeFilterChange={setExchangeFilter}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
      />

      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={center} />

          {/* User Location */}
          <UserLocationMarker
            position={center}
            radiusMeters={radiusKm * 1000}
          />

          {/* Produce / Harvest Markers */}
          {filteredItems.map((item) => {
            // MongoDB coordinates are [longitude, latitude]!
            // Leaflet requires [latitude, longitude]!
            const coords = item.location?.coordinates;
            if (!coords || coords.length < 2) return null;
            const leafletCoords = [coords[1], coords[0]];

            const markerType = item.expectedHarvestDate ? 'HARVEST' : item.exchangeType;

            return (
              <Marker
                key={item._id}
                position={leafletCoords}
                icon={getProduceMarkerIcon(markerType)}
              >
                <Popup>
                  <MapPopup item={item} onSelect={onSelectItem} />
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
