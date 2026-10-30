import apiClient from './apiClient';

export async function validate(code: string) {
  const response = await apiClient.post('/api/admin/tickets/validate', { code });
  return response.data;
}
