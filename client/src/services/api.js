import axios from 'axios';

// In production (same-origin deploy), use relative '/api' path.
// In development, use the full URL to the local server.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'),
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
