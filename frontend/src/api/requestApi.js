import api from './axios';

export const createBloodRequest = (requestData) => api.post('/requests', requestData);
export const createEmergencyBloodRequest = (requestData) => api.post('/requests/emergency', requestData);
export const acceptRequest = (id) => api.put(`/requests/${id}/accept`);
export const rejectRequest = (id) => api.put(`/requests/${id}/reject`);
export const completeRequest = (id) => api.put(`/requests/${id}/complete`);
export const getMyRequests = () => api.get('/requests/my-requests');
export const getDonorRequests = () => api.get('/requests/donor-requests');
