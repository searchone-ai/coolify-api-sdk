import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { EnvironmentVariableSchema, UuidSchema } from '../../schemas.js';

/**
 * GET /applications/{uuid}/envs - Get application environment variables
 */
export class GetApplicationEnvironmentVariablesRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        {},
        z.infer<typeof EnvironmentVariableSchema>[]
    > = {
            method: 'GET',
            path: '/applications/{uuid}/envs',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
            }),
            responseSchema: z.array(EnvironmentVariableSchema)
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
