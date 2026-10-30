import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getMyTickets, getPurchaseTickets } from '../src/services/ticketService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('ticketService', () => {
  it('loads the current user tickets', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [{ id: 1 }] } as never);
    await expect(getMyTickets()).resolves.toEqual([{ id: 1 }]);
    expect(apiClient.get).toHaveBeenCalledWith('/user/tickets');
  });

  it('encodes a purchase id when loading its tickets', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] } as never);
    await expect(getPurchaseTickets('abc/def')).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenCalledWith('/user/purchases/abc%2Fdef/tickets');
  });
});
