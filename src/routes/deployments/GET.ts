import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { UuidSchema } from './schemas.js';

/**
 * Deployment schema for list response
 */
const DeploymentSchema = z.object({
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
 * Response schema for listing deployments
 */
const ListDeploymentsResponseSchema = z.array(DeploymentSchema);

/**
 * GET /deployments - List all deployments
 */
export class ListDeploymentsRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof ListDeploymentsResponseSchema>> = {
        method: 'GET' as const,
        path: '/deployments',
        responseSchema: ListDeploymentsResponseSchema
    };

    /**
     * List all deployments
     * @returns Promise containing array of deployments
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}

// Export types for external use
export type Deployment = z.infer<typeof DeploymentSchema>;
export type ListDeploymentsResponse = z.infer<typeof ListDeploymentsResponseSchema>;
