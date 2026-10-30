import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getConcerts } from '../src/services/concertService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('getConcerts', () => {
  it('returns the concerts from the API client', async () => {
    const concerts = [{ id: 1, name: 'Show', description: '', date: '2026-11-01', price: 10, stock: 4, image_url: null }];
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: concerts } as never);
    await expect(getConcerts()).resolves.toEqual(concerts);
    expect(apiClient.get).toHaveBeenCalledWith('/concerts');
  });
});
