import { z } from 'zod';
import { HttpMethod, ApiResponse } from './types.js';
import { HttpClient } from './http-client.js';

/**
 * Configuration for a route endpoint
 */
export interface RouteConfig<
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TQuery extends Record<string, unknown> = Record<string, unknown>,
    TBody = unknown,
    TResponse = unknown
> {
    /** HTTP method for this route */
    method: HttpMethod;
    /** Path template with parameter placeholders (e.g., '/users/{id}') */
    path: string;
    /** Zod schema for validating path parameters */
    paramsSchema?: z.ZodType<TParams, any, any>;
    /** Zod schema for validating query parameters */
    querySchema?: z.ZodType<TQuery, any, any>;
    /** Zod schema for validating request body */
    bodySchema?: z.ZodType<TBody, any, any>;
    /** Zod schema for validating response data */
    responseSchema?: z.ZodType<TResponse, any, any>;
}

/**
 * Input parameters for making a route request
 */
export interface RouteInput<
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TQuery extends Record<string, unknown> = Record<string, unknown>,
    TBody = unknown
> {
    /** Path parameters to substitute in the route path */
    params?: TParams;
    /** Query parameters to append to the URL */
    query?: TQuery;
    /** Request body data */
    body?: TBody;
    /** Additional headers for this specific request */
    headers?: Record<string, string>;
    /** Request timeout override */
    timeout?: number;
}

/**
 * Base class for implementing API route handlers
 */
export abstract class BaseRoute {
    constructor(protected readonly httpClient: HttpClient) { }

    /**
     * Execute a route with validation and type safety
     */
    protected async executeRoute<
        TParams extends Record<string, unknown>,
        TQuery extends Record<string, unknown>,
        TBody,
        TResponse
    >(
        config: RouteConfig<TParams, TQuery, TBody, TResponse>,
        input: RouteInput<TParams, TQuery, TBody> = {}
    ): Promise<ApiResponse<TResponse>> {
        // Validate input parameters
        const validatedParams = config.paramsSchema
            ? config.paramsSchema.parse(input.params || {})
            : (input.params as TParams);

        const validatedQuery = config.querySchema
            ? config.querySchema.parse(input.query || {})
            : (input.query as TQuery);

        const validatedBody = config.bodySchema
            ? config.bodySchema.parse(input.body)
            : (input.body as TBody);

        // Build the final path by replacing parameters
        const finalPath = this.buildPath(config.path, validatedParams);

        // Make the HTTP request
        return this.httpClient.request(
            {
                method: config.method,
                path: finalPath,
                ...(Object.keys(validatedQuery || {}).length > 0 && { query: validatedQuery }),
                ...(validatedBody !== undefined && { body: validatedBody }),
                ...(input.headers !== undefined && { headers: input.headers }),
                ...(input.timeout !== undefined && { timeout: input.timeout }),
            },
            config.responseSchema
        );
    }

    /**
     * Execute a route with direct data input (no body nesting)
     */
    protected async executeRouteWithData<
        TParams extends Record<string, unknown>,
        TQuery extends Record<string, unknown>,
        TBody,
        TResponse
    >(
        config: RouteConfig<TParams, TQuery, TBody, TResponse>,
        data?: TBody,
        params?: TParams,
        query?: TQuery,
        options?: { headers?: Record<string, string>; timeout?: number }
    ): Promise<ApiResponse<TResponse>> {
        // Validate input parameters
        const validatedParams = config.paramsSchema
            ? config.paramsSchema.parse(params || {})
            : (params as TParams);

        const validatedQuery = config.querySchema
            ? config.querySchema.parse(query || {})
            : (query as TQuery);

        const validatedBody = config.bodySchema && data !== undefined
            ? config.bodySchema.parse(data)
            : (data as TBody);

        // Build the final path by replacing parameters
        const finalPath = this.buildPath(config.path, validatedParams);

        // Make the HTTP request
        return this.httpClient.request(
            {
                method: config.method,
                path: finalPath,
                ...(Object.keys(validatedQuery || {}).length > 0 && { query: validatedQuery }),
                ...(validatedBody !== undefined && { body: validatedBody }),
                ...(options?.headers !== undefined && { headers: options.headers }),
                ...(options?.timeout !== undefined && { timeout: options.timeout }),
            },
            config.responseSchema
        );
    }

    /**
     * Build the final path by replacing parameter placeholders
     */
    private buildPath(pathTemplate: string, params: Record<string, unknown>): string {
        let path = pathTemplate;

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                const placeholder = `{${key}}`;
                if (path.includes(placeholder)) {
                    path = path.replace(placeholder, encodeURIComponent(String(value)));
                }
            });
        }

        return path;
    }
}

/**
 * Interface that all route modules should implement
 */
export interface RouteModule {
    /** The base path for this route module */
    readonly basePath: string;

    /** Initialize the route module with an HTTP client */
    initialize(httpClient: HttpClient): void;
}

/**
 * Type helper for extracting route input types from a route config
 */
export type ExtractRouteInput<T> = T extends RouteConfig<
    infer TParams,
    infer TQuery,
    infer TBody,
    any
>
    ? RouteInput<TParams, TQuery, TBody>
    : never;

/**
 * Type helper for extracting route response types from a route config
 */
export type ExtractRouteResponse<T> = T extends RouteConfig<
    any,
    any,
    any,
    infer TResponse
>
    ? TResponse
    : never;
