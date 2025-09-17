// // import axios from 'axios';

// // const API_BASE = 'http://localhost:8080/api/dosimeters'; // adjust port if needed

// // export const sendReading = (reading) => axios.post(`${API_BASE}/reading`, reading);

// // export const getActiveDevices = () => axios.get(`${API_BASE}/active`);
// // export const getStoppedDevices = () => axios.get(`${API_BASE}/stopped`);
// // export const getDeviceData = (id) => axios.get(`${API_BASE}/${id}/data`);

// // export const exportCSV = (id) => {
// //   window.open(`${API_BASE}/${id}/export/csv`, '_blank');
// // };

// import axios from 'axios';
// // import { configs } from 'eslint-plugin-react-refresh';
// const instance = axios.create({
//   baseURL: 'http://localhost:8080/api', // adjust port if needed
//   // Ensure credentials are sent if backend uses cookies/session
//   // withCredentials: true
// });
// // console.log("API Base URL:-------------------------", 'http://localhost:8080/api')
// // Add token to every request
// instance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     console.log(" Generated Token:----------", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       // Debug: warn if no token found
//       console.warn("No token found in localStorage for API request");
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export const assignDevice = (userId, deviceId) =>
//   instance.post('/assignments/assign', null, {
//     params: { userId, deviceId }
//   });

// export default instance;






























// import axios from 'axios';

// const API_BASE = 'http://localhost:8080/api';

// const api = axios.create({
//   baseURL: API_BASE,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // Request interceptor to add token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('email');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth APIs
// export const login = (credentials) => api.post('/auth/login', credentials);
// export const register = (userData) => api.post('/auth/register', userData);

// // User APIs
// export const getAllUsers = () => api.get('/user/all');
// export const addUser = (userData) => api.post('/user', userData);

// // Dosimeter APIs
// export const getDevicesNeedingAssignment = () => api.get('/dosimeter/devices/needing-assignment');
// export const getAvailableUsers = () => api.get('/dosimeter/users/available');
// export const getActiveDevices = () => api.get('/dosimeter/devices/active');
// export const getDeviceStatus = (deviceId) => api.get(`/dosimeter/device/${deviceId}/status`);

// // Assignment APIs
// export const assignDevice = (userId, deviceId) => 
//   api.post('/dosimeter/assign', null, { params: { userId, deviceId } });
// export const releaseDevice = (deviceId) => 
//   api.post('/dosimeter/release', null, { params: { deviceId } });

// // Reading APIs
// export const sendDeviceData = (data) => api.post('/dosimeter/device/data', data);
// export const sendReading = (reading) => api.post('/dosimeter/reading', reading);
// export const getReadingsByDevice = (deviceId) => api.get(`/dosimeter/device/${deviceId}/readings`);
// export const getReadingsByUser = (userId) => api.get(`/dosimeter/user/${userId}/readings`);
// export const getUserAlerts = (userId) => api.get(`/dosimeter/user/${userId}/alerts`);

// // Export APIs
// export const exportDeviceCsv = (deviceId) => 
//   api.get(`/dosimeter/${deviceId}/export/device-csv`, { responseType: 'blob' });
// export const exportUserCsv = (userId) => 
//   api.get(`/dosimeter/user/${userId}/export/user-csv`, { responseType: 'blob' });

// // Demo API (for testing)
// export const getDemoJson = () => api.get('/get/json');

// export default api;






























import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// User APIs  
export const getAllUsers = () => api.get('/user/all');
export const addUser = (userData) => api.post('/user', userData);

// Fixed Dosimeter APIs to match backend controller
export const getDevicesNeedingAssignment = () => api.get('/dosimeter/devices/needing-assignment');
export const getAvailableUsers = () => api.get('/dosimeter/users/available');
export const getActiveDevices = () => api.get('/dosimeter/devices/active');
export const getDeviceStatus = (deviceId) => api.get(`/dosimeter/device/${deviceId}/status`);
export const getCurrentAssignment = (deviceId) => api.get(`/dosimeter/device/${deviceId}/assignment`);

// Assignment APIs
export const assignDevice = (userId, deviceId) => 
  api.post('/dosimeter/assign', null, { params: { userId, deviceId } });
export const releaseDevice = (deviceId) => 
  api.post('/dosimeter/release', null, { params: { deviceId } });

// Reading APIs
export const getReadingsByDevice = (deviceId) => api.get(`/dosimeter/device/${deviceId}/readings`);
export const getReadingsByUser = (userId) => api.get(`/dosimeter/user/${userId}/readings`);
export const getUserAlerts = (userId) => api.get(`/dosimeter/user/${userId}/alerts`);

// Export APIs
export const exportDeviceCsv = (deviceId) => 
  api.get(`/dosimeter/${deviceId}/export/device-csv`, { responseType: 'blob' });
export const exportUserCsv = (userId) => 
  api.get(`/dosimeter/user/${userId}/export/user-csv`, { responseType: 'blob' });

// Fixed Demo API - This is the key fix!
export const getDemoJson = () => api.get('/dosimeter/demo/data');

export default api;
