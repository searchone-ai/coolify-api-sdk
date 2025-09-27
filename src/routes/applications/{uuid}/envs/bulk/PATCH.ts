import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';

/**
 * UUID validation schema with custom error message
 * Supports the custom 24-character format used by the API
 */
const UuidSchema = z.string().regex(/^[a-z0-9]{24}$/, {
    message: "Must be a valid 24-character UUID format (lowercase letters and numbers only)"
});

/**
 * Create/Update environment variable schema
 */
const CreateEnvironmentVariableSchema = z.object({
    key: z.string().min(1, { message: "Environment variable key is required and cannot be empty" }),
    value: z.string(),
    is_preview: z.boolean().optional(),
    is_build_time: z.boolean().optional(),
    is_literal: z.boolean().optional()
}).transform(data => ({
    ...data,
    is_preview: data.is_preview ?? false,
    is_build_time: data.is_build_time ?? false,
    is_literal: data.is_literal ?? false
}));

/**
 * Request body schema for bulk environment variables creation
 */
const BulkEnvironmentVariablesBodySchema = z.object({
    data: z.array(CreateEnvironmentVariableSchema).min(1, {
        message: "At least one environment variable is required"
    })
});

/**
 * Request parameters schema
 */
const BulkEnvironmentVariablesParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * Complete request schema
 */
const BulkEnvironmentVariablesRequestSchema = z.object({
    params: BulkEnvironmentVariablesParamsSchema,
    body: BulkEnvironmentVariablesBodySchema
});

/**
 * Response schema
 */
const BulkEnvironmentVariablesResponseSchema = z.array(z.object({
    message: z.string().optional()
}));

/**
 * PATCH /applications/{uuid}/envs/bulk - Create multiple environment variables for application
 */
export class CreateBulkApplicationEnvironmentVariablesRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof BulkEnvironmentVariablesParamsSchema>,
        {},
        z.infer<typeof BulkEnvironmentVariablesBodySchema>,
        z.infer<typeof BulkEnvironmentVariablesResponseSchema>
    > = {
            method: 'PATCH' as const,
            path: '/applications/{uuid}/envs/bulk',
            paramsSchema: BulkEnvironmentVariablesParamsSchema,
            bodySchema: BulkEnvironmentVariablesBodySchema,
            responseSchema: BulkEnvironmentVariablesResponseSchema
        };

    /**
     * Create multiple environment variables for an application
     * @param input - Request data containing application UUID and environment variables
     * @returns Promise containing the response message
     */
    async execute(input: {
        params: { uuid: string };
        body: z.infer<typeof BulkEnvironmentVariablesBodySchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type CreateEnvironmentVariable = z.infer<typeof CreateEnvironmentVariableSchema>;
export type BulkEnvironmentVariablesRequest = z.infer<typeof BulkEnvironmentVariablesRequestSchema>;
export type BulkEnvironmentVariablesResponse = z.infer<typeof BulkEnvironmentVariablesResponseSchema>;