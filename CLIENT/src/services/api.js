import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth if token expires
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  deleteAccount: () => api.delete('/auth/delete'),
};

// Notes services
export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  getOne: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// Bookmarks services
export const bookmarksAPI = {
  getAll: (params) => api.get('/bookmarks', { params }),
  getOne: (id) => api.get(`/bookmarks/${id}`),
  create: (data) => api.post('/bookmarks', data),
  update: (id, data) => api.put(`/bookmarks/${id}`, data),
  delete: (id) => api.delete(`/bookmarks/${id}`),
};

export default api;