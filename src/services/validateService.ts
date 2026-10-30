import apiClient from './apiClient';

export interface TicketValidation {
  message?: string;
  ticket?: Record<string, unknown>;
  propietario?: string | Record<string, unknown>;
  owner?: string | Record<string, unknown>;
  concierto?: string | Record<string, unknown>;
  concert?: string | Record<string, unknown>;
  validated_at?: string;
  validatedAt?: string;
  hora?: string;
  [key: string]: unknown;
}

export async function validate(code: string): Promise<TicketValidation> {
  const response = await apiClient.post<TicketValidation>('/admin/tickets/validate', { code });
  return response.data;
}
