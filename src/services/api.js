
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
  
 
});
// console.log("API Base URL:-------------------------", 'http://localhost:8080/api')
// Add token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;

 



