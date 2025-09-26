import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, UuidSchema } from '../schemas.js';

/**
 * GET /databases/{uuid} - Get database by UUID
 */
export class GetDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        {},
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'GET',
            path: '/databases/{uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Database UUID is required and must be a valid UUID" })
            }),
            responseSchema: DatabaseSchema
        };

    /**
     * Get database by UUID
     * @param input - Request parameters containing database UUID
     * @returns Promise containing the database
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}
