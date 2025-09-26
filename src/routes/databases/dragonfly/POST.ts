import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DatabaseSchema, CreateDragonflyDatabaseSchema } from '../schemas.js';

/**
 * POST /databases/dragonfly - Create new Dragonfly database
 */
export class CreateDragonflyDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateDragonflyDatabaseSchema>,
        z.infer<typeof DatabaseSchema>
    > = {
            method: 'POST',
            path: '/databases/dragonfly',
            bodySchema: CreateDragonflyDatabaseSchema,
            responseSchema: DatabaseSchema
        };

    /**
     * Create a new Dragonfly database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateDragonflyDatabaseSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
