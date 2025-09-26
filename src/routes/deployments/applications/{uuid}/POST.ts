import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { DeployApplicationSchema, UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * POST /deployments/applications/{uuid} - Deploy application by UUID
 */
export class DeployApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        z.infer<typeof DeployApplicationSchema>,
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST',
            path: '/deployments/applications/{uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
            }),
            bodySchema: DeployApplicationSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Deploy application by UUID
     * @param input - Request parameters and deploy data
     * @returns Promise containing the deploy operation response
     */
    async execute(input: {
        params: { uuid: string };
        body: z.infer<typeof DeployApplicationSchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}
