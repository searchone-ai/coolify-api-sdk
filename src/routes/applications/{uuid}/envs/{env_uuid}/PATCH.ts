import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';
import { UuidSchema } from '../../../schemas.js';

/**
 * Request parameters schema
 */
const UpdateApplicationEnvironmentVariableParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" }),
    env_uuid: UuidSchema.refine(val => val, { message: "Environment variable UUID is required and must be a valid UUID" })
});

/**
 * Update environment variable request body schema
 */
const UpdateEnvironmentVariableBodySchema = z.object({
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
 * PATCH /applications/{uuid}/envs/{env_uuid} - Update specific environment variable
 */
export class UpdateApplicationEnvironmentVariableRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof UpdateApplicationEnvironmentVariableParamsSchema>,
        {},
        z.infer<typeof UpdateEnvironmentVariableBodySchema>,
        z.infer<typeof EnvironmentVariableResponseSchema>
    > = {
            method: 'PATCH' as const,
            path: '/applications/{uuid}/envs/{env_uuid}',
            paramsSchema: UpdateApplicationEnvironmentVariableParamsSchema,
            bodySchema: UpdateEnvironmentVariableBodySchema,
            responseSchema: EnvironmentVariableResponseSchema
        };

    /**
     * Update specific environment variable by UUIDs
     * @param input - Request parameters and body containing UUIDs and environment variable data
     * @returns Promise containing the updated environment variable
     */
    async execute(input: {
        params: { uuid: string; env_uuid: string };
        body: z.infer<typeof UpdateEnvironmentVariableBodySchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type UpdateApplicationEnvironmentVariableParams = z.infer<typeof UpdateApplicationEnvironmentVariableParamsSchema>;
export type UpdateEnvironmentVariableBody = z.infer<typeof UpdateEnvironmentVariableBodySchema>;
export type EnvironmentVariableResponse = z.infer<typeof EnvironmentVariableResponseSchema>;
