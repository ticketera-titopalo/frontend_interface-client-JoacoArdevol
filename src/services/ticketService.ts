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

export async function getMyTickets(): Promise<Ticket[]> {
  const response = await apiClient.get<Ticket[]>('/user/tickets');
  return response.data;
}

export async function getPurchaseTickets(id: string): Promise<Ticket[]> {
  const response = await apiClient.get<Ticket[]>(`/user/purchases/${encodeURIComponent(id)}/tickets`);
  return response.data;
}
