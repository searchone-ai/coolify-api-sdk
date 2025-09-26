import { z } from 'zod';

/**
 * HTTP methods supported by the SDK
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Base configuration for the Coolify SDK client
 */
export interface CoolifyClientConfig {
    /** Base URL for the Coolify API */
    baseUrl: string;
    /** API token for authentication */
    apiToken: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
    /** Additional headers to include with every request */
    headers?: Record<string, string>;
}

/**
 * HTTP request configuration
 */
export interface RequestConfig {
    method: HttpMethod;
    path: string;
    headers?: Record<string, string> | undefined;
    query?: Record<string, unknown> | undefined;
    body?: unknown;
    timeout?: number | undefined;
}

/**
 * HTTP response wrapper
 */
export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

/**
 * Error response from the API
 */
export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
    status: number;
}

/**
 * Custom error class for SDK errors
 */
export class CoolifyApiError extends Error {
    public readonly status: number;
    public readonly code?: string | undefined;
    public readonly details?: unknown;

    constructor(error: ApiError) {
        super(error.message);
        this.name = 'CoolifyApiError';
        this.status = error.status;
        this.code = error.code;
        this.details = error.details;
    }
}

/**
 * Base schema for API responses
 */
export const BaseResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;
