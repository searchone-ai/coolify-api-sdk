import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { DeployByTagSchema } from '../deployments/schemas.js';
import { BaseResponseSchema } from '../../core/types.js';

/**
 * POST /deploy - Deploy by tag
 */
export class DeployByTagRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof DeployByTagSchema>,
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST',
            path: '/deploy',
            bodySchema: DeployByTagSchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Deploy by tag
     * @param input - Deploy request data
     * @returns Promise containing the deploy operation response
     */
    async execute(input: { body: z.infer<typeof DeployByTagSchema> }) {
        return this.executeRoute(this.config, input);
    }
}
