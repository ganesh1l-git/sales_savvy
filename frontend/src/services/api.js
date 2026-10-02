import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    // Catch SPA routing fallback where Vercel returns index.html (string) for non-existent /api routes
    if (typeof response.data === 'string' && response.data.trim().toLowerCase().startsWith('<!doctype')) {
      const err = new Error('Backend API endpoint not available. Falling back to client data.');
      err.status = 503;
      return Promise.reject(err);
    }
    return response;
  },
  (error) => {
    const customError = {
      status: error.response?.status || error.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

export default api;
