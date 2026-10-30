import apiClient from './apiClient';
import type { AuthUser } from '../types/auth';

export async function getProfile(): Promise<AuthUser> {
  const response = await apiClient.get<AuthUser>('/user/me');
  return response.data;
}
