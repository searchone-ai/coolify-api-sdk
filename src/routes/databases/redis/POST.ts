import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateRedisDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/redis - Create new Redis database
 */
export class CreateRedisDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateRedisDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/redis',
            bodySchema: CreateRedisDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new Redis database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateRedisDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
