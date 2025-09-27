import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * Request parameters schema
 */
const RestartApplicationParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * POST /applications/{uuid}/restart - Restart application
 */
export class RestartApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof RestartApplicationParamsSchema>,
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/applications/{uuid}/restart',
            paramsSchema: RestartApplicationParamsSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Restart application by UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing the restart operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type RestartApplicationParams = z.infer<typeof RestartApplicationParamsSchema>;
