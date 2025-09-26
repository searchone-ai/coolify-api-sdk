import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreateDockerfileApplicationSchema } from '../schemas.js';

/**
 * POST /applications/dockerfile - Create new application based on a Dockerfile
 */
export class CreateDockerfileApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateDockerfileApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/dockerfile',
            bodySchema: CreateDockerfileApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from a Dockerfile
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreateDockerfileApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
