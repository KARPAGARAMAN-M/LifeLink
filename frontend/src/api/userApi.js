import api from './axios';

// Public Real-Time Statistics API
export const getPublicStats = () => api.get('/public/stats');

// User Profile APIs
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (profileData) => api.put('/users/profile', profileData);
