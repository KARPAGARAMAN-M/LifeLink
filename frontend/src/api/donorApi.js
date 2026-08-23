import api from './axios';

export const registerDonor = (donorData) => api.post('/donors', donorData);
export const updateDonor = (donorData) => api.put('/donors', donorData);
export const getMyDonorProfile = () => api.get('/donors/my-profile');
export const toggleAvailability = () => api.patch('/donors/availability');
export const searchDonors = (params) => api.get('/donors/search', { params });
export const getDonorById = (id) => api.get(`/donors/${id}`);
export const checkDonorStatus = () => api.get('/donors/check');
