import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { BaseResponseSchema } from '../../core/types.js';

/**
 * Deploy by tag request schema
 */
const DeployByTagBodySchema = z.object({
    tag: z.string().min(1, { message: "Tag is required and cannot be empty" }),
    force: z.boolean().optional()
}).transform(data => ({
    ...data,
    force: data.force ?? false
}));

/**
 * Deploy by tag response schema
 */
const DeployByTagResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional()
});

/**
 * POST /deploy - Deploy by tag
 */
export class DeployByTagRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof DeployByTagBodySchema>,
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/deploy',
            bodySchema: DeployByTagBodySchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Deploy by tag
     * @param request - Deploy request data
     * @returns Promise containing the deploy operation response
     */
    async execute(request: z.infer<typeof DeployByTagBodySchema>): Promise<z.infer<typeof DeployByTagResponseSchema>> {
        const result = await this.executeRouteWithData(
            this.config,
            request
        );

        return {
            success: result.data?.success ?? true,
            message: result.data?.message
        };
    }
}

// Export types for external use
export type DeployByTagBody = z.infer<typeof DeployByTagBodySchema>;
export type DeployByTagResponse = z.infer<typeof DeployByTagResponseSchema>;
