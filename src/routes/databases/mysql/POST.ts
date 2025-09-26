import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateMySQLDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/mysql - Create new MySQL database
 */
export class CreateMySQLDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateMySQLDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/mysql',
            bodySchema: CreateMySQLDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new MySQL database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateMySQLDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
