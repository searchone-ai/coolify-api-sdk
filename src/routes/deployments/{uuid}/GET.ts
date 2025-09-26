import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { DeploymentSchema, UuidSchema } from '../schemas.js';

/**
 * GET /deployments/{uuid} - Get deployment by UUID
 */
export class GetDeploymentRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string },
        {},
        {},
        z.infer<typeof DeploymentSchema>
    > = {
            method: 'GET',
            path: '/deployments/{uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Deployment UUID is required and must be a valid UUID" })
            }),
            responseSchema: DeploymentSchema
        };

    /**
     * Get deployment by UUID
     * @param input - Request parameters containing deployment UUID
     * @returns Promise containing the deployment
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}
