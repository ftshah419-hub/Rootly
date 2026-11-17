import React from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import { getUserLocationIcon } from './MapMarker.jsx';

export const UserLocationMarker = ({ position, radiusMeters = 0 }) => {
  if (!position || !position[0] || !position[1]) return null;

  // Leaflet expects [latitude, longitude]
  return (
    <>
      <Marker position={position} icon={getUserLocationIcon()}>
        <Popup>
          <div className="text-center p-1">
            <span className="font-semibold text-xs text-olive-800">Your Location</span>
            <p className="text-[10px] text-earth mt-0.5">Exploring hyperlocal garden radius</p>
          </div>
        </Popup>
      </Marker>
      {radiusMeters > 0 && (
        <Circle
          center={position}
          radius={radiusMeters}
          pathOptions={{
            color: '#3E5035',
            fillColor: '#3E5035',
            fillOpacity: 0.08,
            weight: 1.5,
            dashArray: '4, 4'
          }}
        />
      )}
    </>
  );
};

export default UserLocationMarker;
