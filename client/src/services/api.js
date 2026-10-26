import axios from 'axios';

const API_BASE_URL =
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')
        ? import.meta.env.VITE_API_URL
        : '/api')
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to outgoing requests
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

// Format API errors consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    
    // Auto clear expired session on 401
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      // Do not clear immediately on login attempt fail
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const donorAPI = {
  search: (params) => api.get('/donors', { params }),
  getById: (id) => api.get(`/donors/${id}`),
  saveProfile: (data) => api.post('/donors/profile', data),
  toggleAvailability: (availabilityStatus) =>
    api.patch('/donors/availability', { availabilityStatus }),
};

export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my'),
  getAvailable: (params) => api.get('/requests/available', { params }),
  getById: (id) => api.get(`/requests/${id}`),
  respond: (id, action) => api.patch(`/requests/${id}/respond`, { action }),
  cancel: (id) => api.patch(`/requests/${id}/cancel`),
  complete: (id) => api.patch(`/requests/${id}/complete`),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
