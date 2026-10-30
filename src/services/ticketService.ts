import apiClient from './apiClient';

export interface Ticket {
  id: number | string;
  code: string;
  purchase_id: number | string;
  concert_id: number | string;
  concierto: string | { name?: string };
  fecha: string;
  used: boolean;
  created_at: string;
}

export interface TicketCodeInfo {
  concert_name: string;
  date: string;
  user_name: string;
  used: boolean;
}

export async function getMyTickets(): Promise<Ticket[]> {
  const response = await apiClient.get<Ticket[]>('/api/user/tickets');
  return response.data;
}

export async function getPurchaseTickets(id: string): Promise<Ticket[]> {
  const response = await apiClient.get<Ticket[]>(`/api/user/purchases/${encodeURIComponent(id)}/tickets`);
  return response.data;
}

export async function getByCode(code: string): Promise<TicketCodeInfo> {
  const response = await apiClient.get<TicketCodeInfo>(`/api/tickets/code/${encodeURIComponent(code)}`);
  return response.data;
}
