import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { getByCode, getMyTickets, getPurchaseTickets } from '../src/services/ticketService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('ticketService', () => {
  it('loads all tickets and purchase tickets', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [{ id: 1 }] } as never);
    await expect(getMyTickets()).resolves.toEqual([{ id: 1 }]);
    expect(apiClient.get).toHaveBeenLastCalledWith('/api/user/tickets');
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] } as never);
    await expect(getPurchaseTickets('4/5')).resolves.toEqual([]);
    expect(apiClient.get).toHaveBeenLastCalledWith('/api/user/purchases/4%2F5/tickets');
  });

  it('looks up a ticket manually by code', async () => {
    const ticket = { concert_name: 'Show', date: '2026-11-01', user_name: 'Ana', used: false };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: ticket } as never);
    await expect(getByCode('TKT 1')).resolves.toEqual(ticket);
    expect(apiClient.get).toHaveBeenLastCalledWith('/api/tickets/code/TKT%201');
  });
});
