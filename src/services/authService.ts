import apiClient from './apiClient';
import type { AuthUser } from '../types/auth';

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export async function register(email: string, password: string) {
  const response = await apiClient.post<RegisterResponse>('/api/auth/register', { email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', { email, password });
  return response.data;
}

export async function logout(accessToken?: string) {
  const response = await apiClient.post<{ message: string }>('/api/auth/logout', undefined, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  return response.data;
}
