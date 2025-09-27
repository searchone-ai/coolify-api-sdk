import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * Request parameters schema
 */
const StopDatabaseParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Database UUID is required and must be a valid UUID" })
});

/**
 * POST /databases/{uuid}/stop - Stop database
 */
export class StopDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof StopDatabaseParamsSchema>,
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/databases/{uuid}/stop',
            paramsSchema: StopDatabaseParamsSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Stop database by UUID
     * @param input - Request parameters containing database UUID
     * @returns Promise containing the stop operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type StopDatabaseParams = z.infer<typeof StopDatabaseParamsSchema>;
