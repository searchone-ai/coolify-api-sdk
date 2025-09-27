import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * Request parameters schema
 */
const StartDatabaseParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Database UUID is required and must be a valid UUID" })
});

/**
 * POST /databases/{uuid}/start - Start database
 */
export class StartDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof StartDatabaseParamsSchema>,
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/databases/{uuid}/start',
            paramsSchema: StartDatabaseParamsSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Start database by UUID
     * @param input - Request parameters containing database UUID
     * @returns Promise containing the start operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type StartDatabaseParams = z.infer<typeof StartDatabaseParamsSchema>;
