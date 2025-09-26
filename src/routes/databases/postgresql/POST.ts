import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreatePostgreSQLDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/postgresql - Create new PostgreSQL database
 */
export class CreatePostgreSQLDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreatePostgreSQLDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/postgresql',
            bodySchema: CreatePostgreSQLDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new PostgreSQL database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreatePostgreSQLDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
