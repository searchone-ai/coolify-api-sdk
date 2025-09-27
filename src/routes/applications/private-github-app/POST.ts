import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { UuidSchema } from '../schemas.js';

/**
 * Build pack enum schema
 */
const BuildPackSchema = z.enum(['nixpacks', 'static', 'dockerfile', 'dockercompose'], {
    errorMap: () => ({ message: "Build pack must be one of: nixpacks, static, dockerfile, dockercompose" })
});

/**
 * Create private GitHub app application request schema
 */
const CreatePrivateGithubAppApplicationBodySchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    git_repository: z.string().regex(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/, { message: "Git repository must be in owner/repo format (e.g., searchone-ai/mvp2-proxy)" }),
    git_branch: z.string().min(1, { message: "Git branch is required and cannot be empty" }),
    build_pack: BuildPackSchema,
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    github_app_uuid: UuidSchema.refine(val => val, { message: "GitHub App UUID is required and must be a valid UUID" }),
    // Optional fields
    name: z.string().min(1, { message: "Application name is required" }).optional(),
    description: z.string().optional(),
    domains: z.string().optional(),
    git_commit_sha: z.string().optional(),
    docker_registry_image_name: z.string().optional(),
    docker_registry_image_tag: z.string().optional(),
    install_command: z.string().optional(),
    build_command: z.string().optional(),
    start_command: z.string().optional(),
    ports_mappings: z.string().optional(),
    base_directory: z.string().optional(),
    publish_directory: z.string().optional(),
    health_check_enabled: z.boolean().optional(),
    health_check_path: z.string().optional(),
    health_check_port: z.string().optional(),
    health_check_host: z.string().optional(),
    health_check_method: z.string().optional(),
    health_check_return_code: z.number().int().min(100).max(599, { message: "Health check return code must be a valid HTTP status code (100-599)" }).optional(),
    health_check_scheme: z.string().optional(),
    health_check_response_text: z.string().optional(),
    health_check_interval: z.number().int().positive({ message: "Health check interval must be a positive number" }).optional(),
    health_check_timeout: z.number().int().positive({ message: "Health check timeout must be a positive number" }).optional(),
    health_check_retries: z.number().int().min(0, { message: "Health check retries must be 0 or greater" }).optional(),
    health_check_start_period: z.number().int().min(0, { message: "Health check start period must be 0 or greater" }).optional(),
    limits_memory: z.string().optional(),
    limits_memory_swap: z.string().optional(),
    limits_memory_swappiness: z.number().int().min(0).max(100, { message: "Memory swappiness must be between 0 and 100" }).optional(),
    limits_memory_reservation: z.string().optional(),
    limits_cpus: z.string().optional(),
    limits_cpuset: z.string().optional(),
    limits_cpu_shares: z.number().int().positive({ message: "CPU shares must be a positive number" }).optional(),
    custom_network_aliases: z.string().optional()
});

/**
 * Response schema for private GitHub app application creation
 */
const CreatePrivateGithubAppApplicationResponseSchema = z.object({
    uuid: UuidSchema
});

/**
 * POST /applications/private-github-app - Create new application based on a private GitHub App repository
 */
export class CreatePrivateGithubAppApplicationRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreatePrivateGithubAppApplicationBodySchema>,
        z.infer<typeof CreatePrivateGithubAppApplicationResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/applications/private-github-app',
            bodySchema: CreatePrivateGithubAppApplicationBodySchema,
            responseSchema: CreatePrivateGithubAppApplicationResponseSchema
        };

    /**
     * Create a new application from a private GitHub App repository
     * @param input - Application creation data
     * @returns Promise containing the created application
     */
    async execute(input: z.infer<typeof CreatePrivateGithubAppApplicationBodySchema>) {
        return this.executeRouteWithData(this.config, input);
    }
}

// Export types for external use
export type CreatePrivateGithubAppApplicationBody = z.infer<typeof CreatePrivateGithubAppApplicationBodySchema>;
export type CreatePrivateGithubAppApplicationResponse = z.infer<typeof CreatePrivateGithubAppApplicationResponseSchema>;
