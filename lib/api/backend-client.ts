import type { BackendResponse } from "@/lib/types/backend";

/**
 * Backend API Client
 *
 * Provides a typed interface for communicating with the FastAPI backend.
 * Handles authentication, error transformation, and response formatting.
 */

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8000";
const DEFAULT_TIMEOUT = 30000; // 30 seconds

interface RequestOptions {
  timeout?: number;
  retryOn5xx?: boolean;
  maxRetries?: number;
}

class BackendClient {
  private baseUrl: string;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method with timeout and retry logic
   */
  private async request<T>(
    path: string,
    method: string,
    token: string,
    body?: any,
    options: RequestOptions = {},
  ): Promise<BackendResponse<T>> {
    const {
      timeout = DEFAULT_TIMEOUT,
      retryOn5xx = true,
      maxRetries = 2,
    } = options;

    const url = `${this.baseUrl}${path}`;
    let lastError: Error | null = null;

    // Retry logic for 5xx errors
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`,
        };

        // Set content type for JSON bodies
        if (body && !(body instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
          method,
          headers,
          body:
            body instanceof FormData
              ? body
              : body
                ? JSON.stringify(body)
                : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle successful responses
        if (response.ok) {
          const data = await response.json();
          return { data: data as T, error: null };
        }

        // Handle error responses
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Unknown error" }));

        // Don't retry 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          return {
            data: null,
            error: {
              message:
                errorData.detail ||
                `Request failed with status ${response.status}`,
              code: `HTTP_${response.status}`,
            },
          };
        }

        // 5xx errors - retry if enabled
        if (response.status >= 500 && retryOn5xx && attempt < maxRetries) {
          lastError = new Error(errorData.detail || "Server error");
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }

        return {
          data: null,
          error: {
            message: errorData.detail || "Server error",
            code: `HTTP_${response.status}`,
          },
        };
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            return {
              data: null,
              error: {
                message: "Request timeout",
                code: "TIMEOUT",
              },
            };
          }

          // Network errors - retry if enabled
          if (retryOn5xx && attempt < maxRetries) {
            lastError = error;
            await this.delay(Math.pow(2, attempt) * 1000);
            continue;
          }

          return {
            data: null,
            error: {
              message: error.message || "Network error",
              code: "NETWORK_ERROR",
            },
          };
        }

        return {
          data: null,
          error: {
            message: "Unknown error occurred",
            code: "UNKNOWN",
          },
        };
      }
    }

    // Max retries exceeded
    return {
      data: null,
      error: {
        message: lastError?.message || "Request failed after retries",
        code: "MAX_RETRIES_EXCEEDED",
      },
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(
    path: string,
    token: string,
    options?: RequestOptions,
  ): Promise<BackendResponse<T>> {
    return this.request<T>(path, "GET", token, undefined, options);
  }

  /**
   * POST request
   */
  async post<T>(
    path: string,
    body: any,
    token: string,
    options?: RequestOptions,
  ): Promise<BackendResponse<T>> {
    return this.request<T>(path, "POST", token, body, options);
  }

  /**
   * PUT request
   */
  async put<T>(
    path: string,
    body: any,
    token: string,
    options?: RequestOptions,
  ): Promise<BackendResponse<T>> {
    return this.request<T>(path, "PUT", token, body, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(
    path: string,
    token: string,
    options?: RequestOptions,
  ): Promise<BackendResponse<T>> {
    return this.request<T>(path, "DELETE", token, undefined, options);
  }
}

// Export singleton instance
export const backendClient = new BackendClient();

// Export specialized client functions for different modules
export { BackendClient };
