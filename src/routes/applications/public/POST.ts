import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, CreatePublicApplicationSchema } from '../schemas.js';

/**
 * POST /applications/public - Create new application based on a public git repository
 */
export class CreatePublicApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreatePublicApplicationSchema>,
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'POST',
            path: '/applications/public',
            bodySchema: CreatePublicApplicationSchema,
            responseSchema: ApplicationSchema
        };

    /**
     * Create a new application from a public git repository
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: { body: z.infer<typeof CreatePublicApplicationSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
