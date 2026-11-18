import axios, { type AxiosError } from 'axios';

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

function isPublicAuthRequest(endpoint: string): boolean {
  return /\/auth\/(login|register|logout)/.test(endpoint);
}

function clearExpiredSession(): void {
  window.localStorage.removeItem('entrada-token');
  window.localStorage.removeItem('entrada-refresh-token');
  window.localStorage.removeItem('entrada-user');
  window.sessionStorage.setItem('entrada-global-toast', 'Sesi\u00f3n expirada, vuelve a iniciar sesi\u00f3n');
  if (window.location.pathname !== '/login') window.location.assign('/login');
}

function isServerError(status?: number): boolean {
  if (status === undefined) return false;
  return status >= 500;
}

function isExpiredSessionError(error: AxiosError): boolean {
  const status = error.response?.status;
  const endpoint = error.config?.url || '';
  return status === 401 && !isPublicAuthRequest(endpoint);
}

function handleOtherAxiosErrors(error: AxiosError): void {
  const status = error.response?.status;
  if (status === 403) notify('No ten\u00e9s permiso para realizar esta acci\u00f3n.', 'error');
  if (isServerError(status)) notify('Error del servidor, int\u00e9ntalo de nuevo', 'error');
  if (!error.response) notify('No hay conexi\u00f3n a internet', 'error');
}

function handleAxiosResponseError(error: unknown): void {
  if (!axios.isAxiosError(error)) return;
  if (isExpiredSessionError(error)) {
    clearExpiredSession();
    return;
  }
  handleOtherAxiosErrors(error);
}

apiClient.interceptors.response.use((response) => response, (error: unknown) => {
  handleAxiosResponseError(error);
  return Promise.reject(error);
});

export default apiClient;
