import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';
import { UuidSchema } from '../../../schemas.js';

/**
 * Request parameters schema
 */
const GetApplicationEnvironmentVariableParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" }),
    env_uuid: UuidSchema.refine(val => val, { message: "Environment variable UUID is required and must be a valid UUID" })
});

/**
 * Environment variable response schema
 */
const EnvironmentVariableResponseSchema = z.object({
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
 * GET /applications/{uuid}/envs/{env_uuid} - Get specific environment variable
 */
export class GetApplicationEnvironmentVariableRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof GetApplicationEnvironmentVariableParamsSchema>,
        {},
        {},
        z.infer<typeof EnvironmentVariableResponseSchema>
    > = {
            method: 'GET' as const,
            path: '/applications/{uuid}/envs/{env_uuid}',
            paramsSchema: GetApplicationEnvironmentVariableParamsSchema,
            responseSchema: EnvironmentVariableResponseSchema
        };

    /**
     * Get specific environment variable by UUIDs
     * @param input - Request parameters containing application UUID and environment variable UUID
     * @returns Promise containing the environment variable
     */
    async execute(input: { params: { uuid: string; env_uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type GetApplicationEnvironmentVariableParams = z.infer<typeof GetApplicationEnvironmentVariableParamsSchema>;
export type EnvironmentVariableResponse = z.infer<typeof EnvironmentVariableResponseSchema>;
