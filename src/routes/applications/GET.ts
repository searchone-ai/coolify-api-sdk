import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { ApplicationSchema } from './schemas.js';

/**
 * GET /applications - List all applications
 */
export class ListApplicationsRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof ApplicationSchema>[]> = {
        method: 'GET',
        path: '/applications',
        responseSchema: z.array(ApplicationSchema)
    };

    /**
     * List all applications
     * @returns Promise containing array of applications
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}
