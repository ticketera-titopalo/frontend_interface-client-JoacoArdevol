import apiClient from './apiClient';
import type { AuthUser } from '../types/auth';

export type UserProfile = Pick<AuthUser, 'id' | 'email' | 'role' | 'nombre' | 'apellido' | 'dni' | 'telefono'>;
export type EditableProfile = Pick<UserProfile, 'nombre' | 'apellido' | 'dni' | 'telefono'>;

export async function getMe(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/api/user/me');
  return response.data;
}

export async function updateMe(profile: EditableProfile): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>('/api/user/me', profile);
  return response.data;
}
