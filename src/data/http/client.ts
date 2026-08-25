// Wrapper fino de fetch — timeout, headers padrão e erro padronizado.
// Repositories em data/<feature>/ chamam isto (ou um SDK específico, tipo o
// do Firebase); componente e hook nunca chamam fetch/SDK direto.

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT_MS = 10_000;

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  );

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal ?? controller.signal,
    });

    if (!res.ok) {
      throw new HttpError(`Request failed: ${method} ${url}`, res.status, url);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>("GET", url, undefined, options),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", url, body, options),
  put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", url, body, options),
  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>("DELETE", url, undefined, options),
};

export type HttpClient = typeof httpClient;
