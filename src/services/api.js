
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/dosimeters'; // adjust port if needed

export const sendReading = (reading) => axios.post(`${API_BASE}/reading`, reading);

export const getActiveDevices = () => axios.get(`${API_BASE}/active`);
export const getStoppedDevices = () => axios.get(`${API_BASE}/stopped`);
export const getDeviceData = (id) => axios.get(`${API_BASE}/${id}/data`);

export const exportCSV = (id) => {
  window.open(`${API_BASE}/${id}/export/csv`, '_blank');
};
