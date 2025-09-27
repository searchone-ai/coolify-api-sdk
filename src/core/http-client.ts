import { z } from 'zod';
import {
    CoolifyClientConfig,
    RequestConfig,
    ApiResponse,
    CoolifyApiError,
    HttpMethod,
} from './types.js';

/**
 * HTTP client for making requests to the Coolify API
 */
export class HttpClient {
    private readonly config: Required<CoolifyClientConfig>;

    constructor(config: CoolifyClientConfig) {
        this.config = {
            timeout: 30000,
            headers: {},
            ...config,
        };
    }

    /**
     * Make a validated HTTP request
     */
    async request<T>(
        requestConfig: RequestConfig,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        const url = this.buildUrl(requestConfig.path, requestConfig.query);
        const headers = this.buildHeaders(requestConfig.headers);
        const timeout = requestConfig.timeout ?? this.config.timeout;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const body = this.buildBody(requestConfig.body, requestConfig.method);
            const response = await fetch(url, {
                method: requestConfig.method,
                headers,
                ...(body !== undefined && { body }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const responseData = await this.parseResponse(response);

            if (!response.ok) {
                throw new CoolifyApiError({
                    message: responseData.message + JSON.stringify(responseData) || `HTTP ${response.status}: ${response.statusText}`,
                    status: response.status,
                    details: responseData,
                });
            }

            let validatedData: T;
            if (responseSchema) {
                try {
                    validatedData = responseSchema.parse(responseData);
                } catch (validationError) {
                    if (validationError instanceof z.ZodError) {
                        console.warn('Response validation failed:', {
                            path: requestConfig.path,
                            method: requestConfig.method,
                            issues: validationError.issues,
                        });
                    } else {
                        console.warn('Response validation failed with unexpected error:', validationError);
                    }
                    validatedData = responseData as T;
                }
            } else {
                validatedData = responseData as T;
            }

            return {
                data: validatedData,
                status: response.status,
                statusText: response.statusText,
                headers: this.parseHeaders(response.headers),
            };
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof CoolifyApiError) {
                throw error;
            }


            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new CoolifyApiError({
                        message: `Request timeout after ${timeout}ms`,
                        status: 408,
                    });
                }

                throw new CoolifyApiError({
                    message: error.message,
                    status: 0,
                    details: error,
                });
            }

            throw new CoolifyApiError({
                message: 'Unknown error occurred',
                status: 0,
                details: error,
            });
        }
    }

    /**
     * Make a GET request
     */
    async get<T>(
        path: string,
        query?: Record<string, unknown> | undefined,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        return this.request({ method: 'GET', path, ...(query !== undefined && { query }) }, responseSchema);
    }

    /**
     * Make a POST request
     */
    async post<T>(
        path: string,
        body?: unknown,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        return this.request({ method: 'POST', path, body }, responseSchema);
    }

    /**
     * Make a PUT request
     */
    async put<T>(
        path: string,
        body?: unknown,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        return this.request({ method: 'PUT', path, body }, responseSchema);
    }

    /**
     * Make a PATCH request
     */
    async patch<T>(
        path: string,
        body?: unknown,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        return this.request({ method: 'PATCH', path, body }, responseSchema);
    }

    /**
     * Make a DELETE request
     */
    async delete<T>(
        path: string,
        responseSchema?: z.ZodSchema<T>
    ): Promise<ApiResponse<T>> {
        return this.request({ method: 'DELETE', path }, responseSchema);
    }

    private buildUrl(path: string, query?: Record<string, unknown>): string {
        let url: URL;
        const baseUrl = this.config.baseUrl;
        console.log('baseUrl', baseUrl);
        try {
            const cleanPath = path.startsWith('/') ? path : `/${path}`;
            url = new URL(`${baseUrl}${cleanPath}`);
        } catch (error) {
            console.error('Error building URL with path:', (baseUrl + path), 'and query:', query, error);
            throw Error('Error building URL with path: ' + baseUrl + path + ' and query: ' + query);
        }

        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return url.toString();
    }

    private buildHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`,
            'User-Agent': 'coolify-api-sdk/1.0.0',
            ...this.config.headers,
            ...additionalHeaders,
        };
    }

    private buildBody(body: unknown, method: HttpMethod): string | undefined {
        if (!body || method === 'GET' || method === 'DELETE') {
            return undefined;
        }

        return JSON.stringify(body);
    }

    private async parseResponse(response: Response): Promise<any> {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            return response.json();
        }

        const text = await response.text();

        // Try to parse as JSON if it looks like JSON
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            try {
                return JSON.parse(text);
            } catch {
                // Fall through to return as text
            }
        }

        return { message: text };
    }

    private parseHeaders(headers: Headers): Record<string, string> {
        const result: Record<string, string> = {};
        headers.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
}
