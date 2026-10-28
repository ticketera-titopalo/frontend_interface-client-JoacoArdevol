import apiClient from './apiClient';

export interface PurchasePayload {
  concert_id: number;
  quantity: number;
}

export interface PurchaseResponse {
  message: string;
  user_id: number;
  concierto: unknown;
  quantity: number;
  total_price: number;
  nuevo_stock: number;
  purchase_id: number;
  tickets_created: number;
}

export async function createPurchase(payload: PurchasePayload) {
  const response = await apiClient.post<PurchaseResponse>('/purchase', payload);
  return response.data;
}
