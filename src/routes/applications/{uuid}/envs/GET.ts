import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';

/**
 * Request parameters schema
 */
const GetApplicationEnvironmentVariablesParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * Environment variable schema
 */
const EnvironmentVariableSchema = z.object({
    id: z.number().int().positive({ message: "Environment variable ID must be a positive integer" }),
    uuid: UuidSchema,
    key: z.string().min(1, { message: "Environment variable key is required and cannot be empty" }),
    value: z.string(),
    is_preview: z.boolean(),
    is_build_time: z.boolean(),
    is_literal: z.boolean(),
    application_id: z.number().int().positive({ message: "Application ID must be a positive integer" }),
    created_at: z.string().datetime({ message: "Created at must be a valid datetime" }),
    updated_at: z.string().datetime({ message: "Updated at must be a valid datetime" })
});

/**
 * Response schema for environment variables list
 */
const GetApplicationEnvironmentVariablesResponseSchema = z.array(EnvironmentVariableSchema);

/**
 * GET /applications/{uuid}/envs - Get application environment variables
 */
export class GetApplicationEnvironmentVariablesRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof GetApplicationEnvironmentVariablesParamsSchema>,
        {},
        {},
        z.infer<typeof GetApplicationEnvironmentVariablesResponseSchema>
    > = {
            method: 'GET' as const,
            path: '/applications/{uuid}/envs',
            paramsSchema: GetApplicationEnvironmentVariablesParamsSchema,
            responseSchema: GetApplicationEnvironmentVariablesResponseSchema
        };

    /**
     * Get application environment variables by application UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing array of environment variables
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type GetApplicationEnvironmentVariablesParams = z.infer<typeof GetApplicationEnvironmentVariablesParamsSchema>;
export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;
export type GetApplicationEnvironmentVariablesResponse = z.infer<typeof GetApplicationEnvironmentVariablesResponseSchema>;
