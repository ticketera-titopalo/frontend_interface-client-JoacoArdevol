import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getConcert } from '../src/services/concertService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('getConcert', () => {
  it('encodes the id and returns the detail payload', async () => {
    const concert = { id: 'a/b', name: 'Show' };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: concert } as never);
    await expect(getConcert('a/b')).resolves.toEqual(concert);
    expect(apiClient.get).toHaveBeenCalledWith('/concerts/a%2Fb');
  });
});
