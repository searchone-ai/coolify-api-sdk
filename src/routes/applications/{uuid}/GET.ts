import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { ApplicationSchema, UuidSchema } from '../schemas.js';

/**
 * GET /applications/{uuid} - Get application by UUID
 */
export class GetApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        {},
        z.infer<typeof ApplicationSchema>
    > = {
            method: 'GET',
            path: '/applications/{uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
            }),
            responseSchema: ApplicationSchema
        };

    /**
     * Get application by UUID
     * @param input - Request parameters containing application UUID
     * @returns Promise containing the application
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}
