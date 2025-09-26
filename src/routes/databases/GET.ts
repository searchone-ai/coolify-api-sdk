import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { DatabaseSchema } from './schemas.js';

/**
 * GET /databases - List all databases
 */
export class ListDatabasesRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof DatabaseSchema>[]> = {
        method: 'GET',
        path: '/databases',
        responseSchema: z.array(DatabaseSchema)
    };

    /**
     * List all databases
     * @returns Promise containing array of databases
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}
