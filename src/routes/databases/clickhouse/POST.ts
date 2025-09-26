import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateClickHouseDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/clickhouse - Create new ClickHouse database
 */
export class CreateClickHouseDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateClickHouseDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/clickhouse',
            bodySchema: CreateClickHouseDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new ClickHouse database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateClickHouseDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
