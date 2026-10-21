import apiClient from './apiClient';

export async function getEvents() {
  const response = await apiClient.get('/eventos');
  return response.data;
}

export async function getApiStatus() {
  const response = await apiClient.get('/status');
  return response.data;
}
