import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { DeploymentSchema } from './schemas.js';

/**
 * GET /deployments - List all deployments
 */
export class ListDeploymentsRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof DeploymentSchema>[]> = {
        method: 'GET',
        path: '/deployments',
        responseSchema: z.array(DeploymentSchema)
    };

    /**
     * List all deployments
     * @returns Promise containing array of deployments
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}
