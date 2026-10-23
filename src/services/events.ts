import apiClient from './apiClient';
import type { ApiStatus, EventCollectionResponse } from '../types/api';

export async function getApiStatus(): Promise<ApiStatus> {
  const response = await apiClient.get<ApiStatus>('/status');
  return response.data;
}

export async function getEvents(): Promise<EventCollectionResponse> {
  const response = await apiClient.get<EventCollectionResponse>('/eventos');
  return response.data;
}
