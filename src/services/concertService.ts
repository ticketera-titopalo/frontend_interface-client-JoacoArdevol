import apiClient from './apiClient';

export interface Concert {
  id: number | string;
  name: string;
  description: string;
  date: string;
  price: number;
  stock: number;
  image_url: string | null;
}

export interface ConcertPage {
  concerts: Concert[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ConcertFilters {
  q?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export async function getConcerts(filters: ConcertFilters = {}): Promise<ConcertPage> {
  const response = await apiClient.get<ConcertPage>('/api/concerts', { params: filters });
  return response.data;
}

export async function getConcert(id: string): Promise<Concert> {
  const response = await apiClient.get<Concert>(`/api/concerts/${encodeURIComponent(id)}`);
  return response.data;
}
