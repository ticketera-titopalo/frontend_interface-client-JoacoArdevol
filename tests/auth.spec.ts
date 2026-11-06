import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { login, logout, register } from '../src/services/authService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('authService', () => {
  it('sends login credentials and returns both tokens', async () => {
    const session = { access_token: 'access', refresh_token: 'refresh', user: { id: 4, email: 'a@b.com', role: 'user' } };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: session } as never);
    await expect(login('a@b.com', 'secret')).resolves.toEqual(session);
    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', { email: 'a@b.com', password: 'secret' });
  });

  it('registers and logs out using the stable paths', async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { message: 'ok', user: {} } } as never);
    await register('a@b.com', 'secret');
    expect(apiClient.post).toHaveBeenLastCalledWith('/api/auth/register', { email: 'a@b.com', password: 'secret' });
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { message: 'ok' } } as never);
    await logout('access');
    expect(apiClient.post).toHaveBeenLastCalledWith('/api/auth/logout', undefined, { headers: { Authorization: 'Bearer access' } });
  });
});
