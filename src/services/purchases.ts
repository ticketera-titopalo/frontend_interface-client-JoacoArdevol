import apiClient from './apiClient';

export interface PurchasePayload {
  eventoId: string;
  sectorId: string | number;
  cantidad: number;
  asientos: string[];
  comprador: {
    nombre: FormDataEntryValue | null;
    apellido: FormDataEntryValue | null;
    dni: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
  };
}

export async function createPurchase(payload: PurchasePayload, token?: string) {
  return apiClient.post('/compras', payload, token ? {
    headers: { Authorization: `Bearer ${token}` },
  } : undefined);
}
