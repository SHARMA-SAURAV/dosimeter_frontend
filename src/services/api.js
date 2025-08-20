// import axios from 'axios';

// const API_BASE = 'http://localhost:8080/api/dosimeters'; // adjust port if needed

// export const sendReading = (reading) => axios.post(`${API_BASE}/reading`, reading);

// export const getActiveDevices = () => axios.get(`${API_BASE}/active`);
// export const getStoppedDevices = () => axios.get(`${API_BASE}/stopped`);
// export const getDeviceData = (id) => axios.get(`${API_BASE}/${id}/data`);

// export const exportCSV = (id) => {
//   window.open(`${API_BASE}/${id}/export/csv`, '_blank');
// };

import axios from 'axios';
// import { configs } from 'eslint-plugin-react-refresh';
const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // adjust port if needed
  // Ensure credentials are sent if backend uses cookies/session
  // withCredentials: true
});
// console.log("API Base URL:-------------------------", 'http://localhost:8080/api')
// Add token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(" Generated Token:----------", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Debug: warn if no token found
      console.warn("No token found in localStorage for API request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const assignDevice = (userId, deviceId) =>
  instance.post('/assignments/assign', null, {
    params: { userId, deviceId }
  });

export default instance;





