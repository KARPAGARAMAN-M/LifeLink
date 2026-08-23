import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
    permissionDenied: false,
    city: '',
    state: '',
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
          error: null,
          loading: false,
          permissionDenied: false,
          city: '',
          state: '',
        });
      },
      (error) => {
        let errorMsg = 'Unable to retrieve location.';
        let isDenied = false;

        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied by user.';
          isDenied = true;
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }

        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
          permissionDenied: isDenied,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return {
    ...location,
    requestLocation,
  };
}
