type ErrorResponse = {
  response?: {
    data?: { message?: unknown; mensaje?: unknown; error?: unknown };
  };
};

function getResponseMessage(error: unknown) {
  if (!error || typeof error !== 'object') return undefined;
  const responseData = (error as ErrorResponse).response?.data;
  return [responseData?.message, responseData?.mensaje, responseData?.error]
    .find((value): value is string => typeof value === 'string' && Boolean(value.trim()));
}

export function getErrorMessage(error: unknown, fallback: string) {
  return getResponseMessage(error) || fallback;
}
