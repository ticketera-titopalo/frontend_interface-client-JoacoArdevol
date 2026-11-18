type ErrorPayload = { message?: unknown; mensaje?: unknown; error?: unknown };
type HttpErrorShape = { response?: { data?: ErrorPayload } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readErrorPayload(value: unknown): ErrorPayload | undefined {
  if (!isRecord(value)) return undefined;
  return { message: value.message, mensaje: value.mensaje, error: value.error };
}

function readHttpError(error: unknown): HttpErrorShape | undefined {
  if (!isRecord(error)) return undefined;
  const response = error.response;
  if (!isRecord(response)) return undefined;
  return { response: { data: readErrorPayload(response.data) } };
}

function firstMessage(data?: ErrorPayload): unknown {
  if (!data) return undefined;
  return data.message || data.mensaje || data.error;
}

function usableMessage(message: unknown): message is string {
  if (typeof message !== 'string') return false;
  return message.trim().length > 0;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const httpError = readHttpError(error);
  if (!httpError) return fallback;
  const message = firstMessage(httpError.response?.data);
  if (!usableMessage(message)) return fallback;
  return message;
}
