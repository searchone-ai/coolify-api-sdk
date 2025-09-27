import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../core/route-interface.js';
import { UuidSchema } from '../../schemas.js';
import { BaseResponseSchema } from '../../../../core/types.js';

/**
 * Request parameters schema
 */
const DeployApplicationParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
});

/**
 * Deploy application request body schema
 */
const DeployApplicationBodySchema = z.object({
    force: z.boolean().optional(),
    instant_deploy: z.boolean().optional(),
    git_type: z.enum(['github', 'gitlab', 'bitbucket', 'gitea'], {
        errorMap: () => ({ message: "Git type must be one of: github, gitlab, bitbucket, gitea" })
    }).optional(),
    commit_sha: z.string().optional(),
    pull_request_id: z.number().int().positive({ message: "Pull request ID must be a positive integer" }).optional()
}).transform(data => ({
    ...data,
    force: data.force ?? false,
    instant_deploy: data.instant_deploy ?? false
}));

/**
 * POST /deployments/applications/{uuid} - Deploy application by UUID
 */
export class DeployApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof DeployApplicationParamsSchema>,
        {},
        z.infer<typeof DeployApplicationBodySchema>,
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/deployments/applications/{uuid}',
            paramsSchema: DeployApplicationParamsSchema,
            bodySchema: DeployApplicationBodySchema,
            responseSchema: BaseResponseSchema
        };

    /**
     * Deploy application by UUID
     * @param input - Request parameters and deploy data
     * @returns Promise containing the deploy operation response
     */
    async execute(input: {
        params: { uuid: string };
        body: z.infer<typeof DeployApplicationBodySchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type DeployApplicationParams = z.infer<typeof DeployApplicationParamsSchema>;
export type DeployApplicationBody = z.infer<typeof DeployApplicationBodySchema>;
