import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getConcerts } from '../src/services/concertService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('getConcerts', () => {
  it('sends filters and returns the paginated concert contract', async () => {
    const page = { concerts: [{ id: 2, name: 'Show' }], total: 1, page: 1, limit: 10, total_pages: 1 };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: page } as never);
    await expect(getConcerts({ q: 'Show', page: 1, limit: 10 })).resolves.toEqual(page);
    expect(apiClient.get).toHaveBeenCalledWith('/api/concerts', { params: { q: 'Show', page: 1, limit: 10 } });
  });
});
