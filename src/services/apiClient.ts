import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, ''),
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

function notify(message: string, type: 'info' | 'error') {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, type } }));
}

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('entrada-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use((response) => response, (error: unknown) => {
  if (!axios.isAxiosError(error)) return Promise.reject(error);
  const status = error.response?.status;
  const endpoint = error.config?.url || '';
  if (status === 401 && !/\/auth\/(login|register|logout)/.test(endpoint)) {
    window.localStorage.removeItem('entrada-token');
    window.localStorage.removeItem('entrada-refresh-token');
    window.localStorage.removeItem('entrada-user');
    window.sessionStorage.setItem('entrada-global-toast', 'Sesión expirada, vuelve a iniciar sesión');
    if (window.location.pathname !== '/login') window.location.assign('/login');
  } else if (status === 403) {
    notify('No tenés permiso para realizar esta acción.', 'error');
  } else if (status && status >= 500) {
    notify('Error del servidor, inténtalo de nuevo', 'error');
  } else if (!error.response) {
    notify('No hay conexión a internet', 'error');
  }
  return Promise.reject(error);
});

export default apiClient;
