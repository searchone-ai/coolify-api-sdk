import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreatePrivateGithubAppApplicationSchema } from '../schemas.js';

/**
 * POST /applications/private-github-app - Create new application based on a private GitHub App repository
 */
export class CreatePrivateGithubAppApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreatePrivateGithubAppApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/private-github-app',
            bodySchema: CreatePrivateGithubAppApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from a private GitHub App repository
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreatePrivateGithubAppApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
