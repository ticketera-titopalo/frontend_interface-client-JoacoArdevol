import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getConcert } from '../src/services/concertService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('getConcert', () => {
  it('encodes the concert id and returns its detail', async () => {
    const detail = { id: 'a/b', name: 'Show', date: '2026-11-01', price: 100, stock: 5, description: '', image_url: null };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: detail } as never);
    await expect(getConcert('a/b')).resolves.toEqual(detail);
    expect(apiClient.get).toHaveBeenCalledWith('/api/concerts/a%2Fb');
  });
});
