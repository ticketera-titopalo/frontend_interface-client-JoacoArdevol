type ErrorPayload = { message?: unknown; mensaje?: unknown; error?: unknown };

function isObject(value: unknown): value is { response?: { data?: ErrorPayload } } {
  return Boolean(value) && typeof value === 'object';
}

function firstMessage(data?: ErrorPayload) {
  return data?.message || data?.mensaje || data?.error;
}

function usableMessage(message: unknown): message is string {
  return typeof message === 'string' && Boolean(message.trim());
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (!isObject(error)) return fallback;
  const message = firstMessage(error.response?.data);
  return usableMessage(message) ? message : fallback;
}
