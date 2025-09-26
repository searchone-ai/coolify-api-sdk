import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * POST /databases/{uuid}/restart - Restart database
 */
export class RestartDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST',
            path: '/databases/{uuid}/restart',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Database UUID is required and must be a valid UUID" })
            }),
            responseSchema: BaseResponseSchema
        };

    /**
     * Restart database by UUID
     * @param input - Request parameters containing database UUID
     * @returns Promise containing the restart operation response
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}
