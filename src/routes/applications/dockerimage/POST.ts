import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreateDockerImageApplicationSchema } from '../schemas.js';

/**
 * POST /applications/dockerimage - Create new application based on a Docker image
 */
export class CreateDockerImageApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateDockerImageApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/dockerimage',
            bodySchema: CreateDockerImageApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from a Docker image
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreateDockerImageApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
