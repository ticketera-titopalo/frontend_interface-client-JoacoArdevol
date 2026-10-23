import apiClient from './apiClient';
import type { AuthUser } from '../types/auth';

const authMode = import.meta.env.VITE_AUTH_MODE || 'demo';

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export async function register(email: string, password: string) {
  if (authMode === 'demo') {
    return {
      message: 'Cuenta de demostración creada.',
      user: { id: `demo-${email.toLowerCase()}`, email, role: 'user' },
    };
  }

  const response = await apiClient.post<RegisterResponse>('/auth/register', { email, password });
  return response.data;
}

export async function login(email: string, password: string) {
  if (authMode === 'demo') {
    if (!email.trim() || !password) throw new Error('Ingresá email y contraseña.');
    return {
      access_token: `demo-token-${Date.now()}`,
      user: {
        id: `demo-${email.toLowerCase()}`,
        email,
        role: email.trim().toLowerCase() === 'admin@entrada.com' ? 'admin' : 'user',
      },
    };
  }

  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}
