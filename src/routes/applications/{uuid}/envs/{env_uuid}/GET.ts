import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';
import { EnvironmentVariableSchema, UuidSchema } from '../../../schemas.js';

/**
 * GET /applications/{uuid}/envs/{env_uuid} - Get specific environment variable
 */
export class GetApplicationEnvironmentVariableRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string; env_uuid: string },
        {},
        {},
        z.infer<typeof EnvironmentVariableSchema>
    > = {
            method: 'GET',
            path: '/applications/{uuid}/envs/{env_uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" }),
                env_uuid: UuidSchema.refine(val => val, { message: "Environment variable UUID is required and must be a valid UUID" })
            }),
            responseSchema: EnvironmentVariableSchema
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
