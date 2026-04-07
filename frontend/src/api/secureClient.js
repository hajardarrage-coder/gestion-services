import axios from 'axios';

const baseURL = import.meta.env.VITE_SECURE_API_URL || import.meta.env.VITE_API_URL;

export const secureClient = axios.create({
  baseURL,
  timeout: 12000,
});

secureClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

secureClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Erreur reseau';
    return Promise.reject({ ...error, friendlyMessage: message });
  },
);
