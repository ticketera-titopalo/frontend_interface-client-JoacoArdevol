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

export async function getConcerts(): Promise<Concert[]> {
  const response = await apiClient.get<Concert[]>('/concerts');
  return response.data;
}

export async function getConcert(id: string): Promise<Concert> {
  const response = await apiClient.get<Concert>(`/concerts/${encodeURIComponent(id)}`);
  return response.data;
}
