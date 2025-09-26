import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateKeyDBDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/keydb - Create new KeyDB database
 */
export class CreateKeyDBDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateKeyDBDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/keydb',
            bodySchema: CreateKeyDBDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new KeyDB database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateKeyDBDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
