import type { ApiErrorPayload } from "../types/api";

// Thrown for any non-2xx HTTP response. `status` lets callers branch on
// specific outcomes (401, 404, 409, ...) without parsing strings.
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestBody = unknown;

// A thin, dependency-free fetch wrapper. One instance is created per backend
// service (see api/identityApi.ts, api/tripApi.ts, etc.) with that service's
// base URL, so feature code never hardcodes a host and never repeats
// header/error-handling logic.
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  get<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
    return this.send<TResponse>(path, { ...init, method: "GET" });
  }

  post<TResponse>(path: string, body?: RequestBody, init?: RequestInit): Promise<TResponse> {
    return this.send<TResponse>(path, { ...init, method: "POST", body: serialize(body) });
  }

  put<TResponse>(path: string, body?: RequestBody, init?: RequestInit): Promise<TResponse> {
    return this.send<TResponse>(path, { ...init, method: "PUT", body: serialize(body) });
  }

  delete<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
    return this.send<TResponse>(path, { ...init, method: "DELETE" });
  }

  private async send<TResponse>(path: string, init: RequestInit): Promise<TResponse> {
    const response = await fetch(`${this.baseUrl}/${path.replace(/^\/+/, "")}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(await readErrorMessage(response), response.status);
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
  }
}

function serialize(body: RequestBody): BodyInit | undefined {
  return body === undefined ? undefined : JSON.stringify(body);
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    const firstValidationError = Object.values(payload.errors ?? {})[0]?.[0];

    return payload.message ?? payload.detail ?? firstValidationError ?? payload.title ?? response.statusText;
  } catch {
    return response.statusText || `Request failed with status ${response.status}`;
  }
}
