import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateMariaDBDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/mariadb - Create new MariaDB database
 */
export class CreateMariaDBDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateMariaDBDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/mariadb',
            bodySchema: CreateMariaDBDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new MariaDB database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateMariaDBDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
