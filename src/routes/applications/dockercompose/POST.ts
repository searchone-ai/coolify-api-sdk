import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreateDockerComposeApplicationSchema } from '../schemas.js';

/**
 * POST /applications/dockercompose - Create new application based on Docker Compose
 */
export class CreateDockerComposeApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateDockerComposeApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/dockercompose',
            bodySchema: CreateDockerComposeApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from Docker Compose
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreateDockerComposeApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
