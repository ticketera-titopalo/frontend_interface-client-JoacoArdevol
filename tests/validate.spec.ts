import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { validate } from '../src/services/validateService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('validate', () => {
  it('posts a ticket code to the admin validation contract', async () => {
    const result = { valid: true };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: result } as never);
    await expect(validate('TKT-123')).resolves.toEqual(result);
    expect(apiClient.post).toHaveBeenCalledWith('/admin/tickets/validate', { code: 'TKT-123' });
  });
});
