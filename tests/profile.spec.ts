import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getProfile } from '../src/services/profileService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('getProfile', () => {
  it('loads the current user profile', async () => {
    const profile = { id: 4, email: 'ana@example.com', role: 'user' };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: profile } as never);
    await expect(getProfile()).resolves.toEqual(profile);
    expect(apiClient.get).toHaveBeenCalledWith('/user/me');
  });
});
