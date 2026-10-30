import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { login, register } from '../src/services/authService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('authService', () => {
  it('creates a demo account from the provided email', async () => {
    const result = await register('ana@example.com', 'secret');
    expect(result.user.email).toBe('ana@example.com');
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('rejects empty demo credentials', async () => {
    await expect(login('', '')).rejects.toThrow('Ingresá email y contraseña.');
  });
});
