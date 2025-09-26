import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';
import { EnvironmentVariableSchema, CreateEnvironmentVariableSchema, UuidSchema } from '../../../schemas.js';

/**
 * PATCH /applications/{uuid}/envs/{env_uuid} - Update specific environment variable
 */
export class UpdateApplicationEnvironmentVariableRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string; env_uuid: string },
        {},
        z.infer<typeof CreateEnvironmentVariableSchema>,
        z.infer<typeof EnvironmentVariableSchema>
    > = {
            method: 'PATCH',
            path: '/applications/{uuid}/envs/{env_uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" }),
                env_uuid: UuidSchema.refine(val => val, { message: "Environment variable UUID is required and must be a valid UUID" })
            }),
            bodySchema: CreateEnvironmentVariableSchema,
            responseSchema: EnvironmentVariableSchema
        };

    /**
     * Update specific environment variable by UUIDs
     * @param input - Request parameters and body containing UUIDs and environment variable data
     * @returns Promise containing the updated environment variable
     */
    async execute(input: {
        params: { uuid: string; env_uuid: string };
        body: z.infer<typeof CreateEnvironmentVariableSchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}
