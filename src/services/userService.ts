import apiClient from './apiClient';

export interface UserProfile {
  id: number | string;
  email: string;
  role: string;
  nombre: string | null;
  apellido: string | null;
  dni: string | null;
  telefono: string | null;
}

export interface UserProfileUpdate {
  nombre: string;
  apellido: string;
  telefono: string;
  dni: string;
}

export async function getMe(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/user/me');
  return response.data;
}

export async function updateMe(profile: UserProfileUpdate): Promise<UserProfile> {
  const response = await apiClient.put<UserProfile>('/user/me', profile);
  return response.data;
}
