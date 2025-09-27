import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';

/**
 * Request parameters schema
 */
const StartApplicationParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * Response schema for starting application
 */
const StartApplicationResponseSchema = z.object({
    message: z.string(),
    deployment_uuid: z.string()
});

/**
 * POST /applications/{uuid}/start - Start application
 */
export class StartApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof StartApplicationParamsSchema>,
        {},
        {},
        z.infer<typeof StartApplicationResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/applications/{uuid}/start',
            paramsSchema: StartApplicationParamsSchema,
            responseSchema: StartApplicationResponseSchema
        };

    /**
     * Start application by UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing the start operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type StartApplicationParams = z.infer<typeof StartApplicationParamsSchema>;
export type StartApplicationResponse = z.infer<typeof StartApplicationResponseSchema>;