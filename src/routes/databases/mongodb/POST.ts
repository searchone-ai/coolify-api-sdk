import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateMongoDBDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/mongodb - Create new MongoDB database
 */
export class CreateMongoDBDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateMongoDBDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/mongodb',
            bodySchema: CreateMongoDBDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new MongoDB database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateMongoDBDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
