import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreatePrivateDeployKeyApplicationSchema } from '../schemas.js';

/**
 * POST /applications/private-deploy-key - Create new application based on a private repository with deploy key
 */
export class CreatePrivateDeployKeyApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreatePrivateDeployKeyApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/private-deploy-key',
            bodySchema: CreatePrivateDeployKeyApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from a private repository using deploy key
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreatePrivateDeployKeyApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
