import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { UuidSchema } from '../schemas.js';

/**
 * Request parameters schema for DELETE operation
 */
const DeleteApplicationParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

const DeleteApplicationResponseSchema = z.object({
    message: z.string()
});

/**
 * DELETE /applications/{uuid} - Delete application by UUID
 */
export class DeleteApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof DeleteApplicationParamsSchema>,
        {},
        {},
        z.infer<typeof DeleteApplicationResponseSchema>
    > = {
            method: 'DELETE' as const,
            path: '/applications/{uuid}',
            paramsSchema: DeleteApplicationParamsSchema,
            responseSchema: DeleteApplicationResponseSchema
        };

    /**
     * Delete application by UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing the deletion response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type DeleteApplicationParams = z.infer<typeof DeleteApplicationParamsSchema>;
export type DeleteApplicationResponse = z.infer<typeof DeleteApplicationResponseSchema>;
