import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { createPurchase } from '../src/services/purchaseService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('createPurchase', () => {
  it('posts the fixed concert_id and quantity payload', async () => {
    const payload = { concert_id: 12, quantity: 2 };
    const response = { purchase_id: 5, tickets_created: 2, nuevo_stock: 3 };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: response } as never);
    await expect(createPurchase(payload)).resolves.toEqual(response);
    expect(apiClient.post).toHaveBeenCalledWith('/api/purchase', payload);
  });
});
