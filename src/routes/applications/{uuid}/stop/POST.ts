import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * Request parameters schema
 */
const StopApplicationParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * POST /applications/{uuid}/stop - Stop application
 */
export class StopApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof StopApplicationParamsSchema>,
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/applications/{uuid}/stop',
            paramsSchema: StopApplicationParamsSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Stop application by UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing the stop operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type StopApplicationParams = z.infer<typeof StopApplicationParamsSchema>;
