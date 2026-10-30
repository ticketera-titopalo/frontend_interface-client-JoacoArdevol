import { describe, expect, it, vi } from 'vitest';
import apiClient from '../src/services/apiClient';
import { validate } from '../src/services/validateService';

vi.mock('../src/services/apiClient', () => ({ default: { get: vi.fn(), post: vi.fn(), put: vi.fn() } }));

describe('validate', () => {
  it('posts a ticket code to the admin validation endpoint', async () => {
    const result = { message: 'Validada', user_name: 'Ana' };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: result } as never);
    await expect(validate('TKT-123')).resolves.toEqual(result);
    expect(apiClient.post).toHaveBeenCalledWith('/api/admin/tickets/validate', { code: 'TKT-123' });
  });
});
