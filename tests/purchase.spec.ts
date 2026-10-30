import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { createPurchase } from '../src/services/purchases';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('createPurchase', () => {
  it('sends the concert id and quantity and returns the purchase result', async () => {
    const payload = { concert_id: 9, quantity: 2 };
    const result = { purchase_id: 3, tickets_created: 2 };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: result } as never);
    await expect(createPurchase(payload)).resolves.toEqual(result);
    expect(apiClient.post).toHaveBeenCalledWith('/purchase', payload);
  });
});
