import { useState, useEffect, useCallback } from 'react';

// Default Central Kochi Coordinates [latitude, longitude]
export const DEFAULT_KOCHI_LOCATION = [9.9674, 76.2999];

export const useGeolocation = (defaultCoords = DEFAULT_KOCHI_LOCATION) => {
  const [coordinates, setCoordinates] = useState(() => {
    const saved = localStorage.getItem('rootly_user_coords');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 2) return parsed;
      } catch {
        // Fallback to default
      }
    }
    return defaultCoords;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = [pos.coords.latitude, pos.coords.longitude];
        setCoordinates(newCoords);
        localStorage.setItem('rootly_user_coords', JSON.stringify(newCoords));
        setIsLoading(false);
      },
      (err) => {
        let msg = 'Could not determine current location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location permission denied. Using default neighborhood area.';
          setPermissionStatus('denied');
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out. Using default neighborhood area.';
        }
        setError(msg);
        setIsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        setPermissionStatus(status.state);
        status.onchange = () => setPermissionStatus(status.state);
      }).catch(() => {});
    }
  }, []);

  const setManualLocation = (coords) => {
    if (Array.isArray(coords) && coords.length === 2) {
      setCoordinates(coords);
      localStorage.setItem('rootly_user_coords', JSON.stringify(coords));
    }
  };

  return {
    coordinates, // [lat, lng] for Leaflet
    longitude: coordinates[1],
    latitude: coordinates[0],
    isLoading,
    error,
    permissionStatus,
    requestLocation,
    setManualLocation
  };
};

export default useGeolocation;
