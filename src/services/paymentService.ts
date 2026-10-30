import apiClient from './apiClient';

export interface WalletIdentity {
  wallet_id?: string | number;
  nombre?: string;
  alias?: string;
  cvu?: string;
}

export interface PaymentIntent {
  transaction_id?: string | number;
  id?: string | number;
  pagador?: WalletIdentity;
  payer?: WalletIdentity;
  cvu_origen?: string;
  cvu_destino?: string;
  monto?: number | string;
  concepto?: string;
  [key: string]: unknown;
}

export async function consultarDestino(destino: string): Promise<WalletIdentity> {
  const { data } = await apiClient.post('/red/consultar-destino', { destino });
  return data;
}

export async function notificarIntencion(payload: {
  destino: string;
  pagador: WalletIdentity;
  monto: number;
  concepto: string;
}) {
  const { data } = await apiClient.post('/red/notificar-intencion', payload);
  return data;
}

export async function transferir(payload: {
  transaction_id: string | number;
  cvu_origen: string;
  cvu_destino: string;
  monto: number | string;
}) {
  const { data } = await apiClient.post('/red/transferir', payload);
  return data;
}

export async function consultarIntenciones(destino: string): Promise<PaymentIntent[]> {
  const { data } = await apiClient.post('/red/consultar-intenciones', { destino });
  return Array.isArray(data) ? data : data.intenciones || [];
}

// El contrato compartido no define el endpoint de rechazo; esta ruta sigue el patrón red del backend.
export async function rechazarIntencion(transaction_id: string | number) {
  const { data } = await apiClient.post('/red/rechazar-intencion', { transaction_id });
  return data;
}
