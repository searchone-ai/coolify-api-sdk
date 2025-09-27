import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { UuidSchema } from '../schemas.js';

/**
 * Request parameters schema
 */
const GetDeploymentParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Deployment UUID is required and must be a valid UUID" })
});

/**
 * Deployment response schema
 */
const DeploymentResponseSchema = z.object({
    id: z.number().int().positive({ message: "Deployment ID must be a positive integer" }),
    uuid: UuidSchema,
    status: z.string().min(1, { message: "Deployment status is required" }),
    application_id: z.number().int().positive({ message: "Application ID must be a positive integer" }).nullable().optional(),
    application_name: z.string().nullable().optional(),
    server_name: z.string().nullable().optional(),
    commit: z.string().nullable().optional(),
    branch: z.string().nullable().optional(),
    pull_request_id: z.number().int().nullable().optional(),
    is_webhook: z.boolean(),
    is_api: z.boolean(),
    created_at: z.string().datetime({ message: "Created at must be a valid datetime" }),
    updated_at: z.string().datetime({ message: "Updated at must be a valid datetime" })
});

/**
 * GET /deployments/{uuid} - Get deployment by UUID
 */
export class GetDeploymentRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof GetDeploymentParamsSchema>,
        {},
        {},
        z.infer<typeof DeploymentResponseSchema>
    > = {
            method: 'GET' as const,
            path: '/deployments/{uuid}',
            paramsSchema: GetDeploymentParamsSchema,
            responseSchema: DeploymentResponseSchema
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

// Export types for external use
export type GetDeploymentParams = z.infer<typeof GetDeploymentParamsSchema>;
export type DeploymentResponse = z.infer<typeof DeploymentResponseSchema>;
