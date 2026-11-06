import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getMe, updateMe } from '../src/services/userService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('userService', () => {
  it('loads the current profile', async () => {
    const profile = { id: 1, email: 'a@b.com', role: 'user', nombre: 'Ana', apellido: 'Paz', dni: '123', telefono: '555' };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: profile } as never);
    await expect(getMe()).resolves.toEqual(profile);
    expect(apiClient.get).toHaveBeenCalledWith('/api/user/me');
  });

  it('updates only editable profile fields', async () => {
    const fields = { nombre: 'Ana', apellido: 'Paz', dni: '123', telefono: '555' };
    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: { ...fields, id: 1, email: 'a@b.com', role: 'user' } } as never);
    await updateMe(fields);
    expect(apiClient.put).toHaveBeenCalledWith('/api/user/me', fields);
  });
});
