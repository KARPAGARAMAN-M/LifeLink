import api from './axios';

export const submitReport = (reportData) => api.post('/reports', reportData);
export const getAllReports = () => api.get('/reports');
export const updateReportStatus = (id, status) => api.patch(`/reports/${id}/status`, null, { params: { status } });
