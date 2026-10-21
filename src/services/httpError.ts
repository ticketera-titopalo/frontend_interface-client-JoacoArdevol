export function getErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object') return fallback;
  const responseData = (error as { response?: { data?: { message?: unknown; mensaje?: unknown; error?: unknown } } }).response?.data;
  const message = responseData?.message || responseData?.mensaje || responseData?.error;
  return typeof message === 'string' && message.trim() ? message : fallback;
}
