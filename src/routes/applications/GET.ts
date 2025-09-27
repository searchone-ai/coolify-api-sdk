import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { UuidSchema } from './schemas.js';

/**
 * Build pack enum schema
 */
const BuildPackSchema = z.enum(['nixpacks', 'static', 'dockerfile', 'dockercompose'], {
    errorMap: () => ({ message: "Build pack must be one of: nixpacks, static, dockerfile, dockercompose" })
});

/**
 * Application schema for list response
 */
const ApplicationSchema = z.object({
    id: z.number().int().positive({ message: "Application ID must be a positive integer" }),
    description: z.string().nullable().optional(),
    repository_project_id: z.number().int().positive().nullable().optional(),
    uuid: UuidSchema,
    name: z.string().min(1, { message: "Application name is required and cannot be empty" }),
    fqdn: z.string().nullable().optional(),
    config_hash: z.string().min(1, { message: "Configuration hash is required" }),
    git_repository: z.string().url({ message: "Git repository must be a valid URL" }),
    git_branch: z.string().min(1, { message: "Git branch is required and cannot be empty" }),
    git_commit_sha: z.string().min(1, { message: "Git commit SHA is required" }),
    git_full_url: z.string().url().nullable().optional(),
    docker_registry_image_name: z.string().nullable().optional(),
    docker_registry_image_tag: z.string().nullable().optional(),
    build_pack: BuildPackSchema,
    static_image: z.string().min(1, { message: "Static image is required when using static build pack" }),
    install_command: z.string(),
    build_command: z.string(),
    start_command: z.string(),
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    ports_mappings: z.string().nullable().optional(),
    custom_network_aliases: z.string().nullable().optional(),
    base_directory: z.string(),
    publish_directory: z.string(),
    health_check_enabled: z.boolean(),
    health_check_path: z.string(),
    health_check_port: z.string().nullable().optional(),
    health_check_host: z.string().nullable().optional(),
    health_check_method: z.string().min(1, { message: "Health check method is required" }),
    health_check_return_code: z.number().int().min(100).max(599, { message: "Health check return code must be a valid HTTP status code (100-599)" }),
    health_check_scheme: z.string().min(1, { message: "Health check scheme is required" }),
    health_check_response_text: z.string().nullable().optional(),
    health_check_interval: z.number().int().positive({ message: "Health check interval must be a positive number" }),
    health_check_timeout: z.number().int().positive({ message: "Health check timeout must be a positive number" }),
    health_check_retries: z.number().int().min(0, { message: "Health check retries must be 0 or greater" }),
    health_check_start_period: z.number().int().min(0, { message: "Health check start period must be 0 or greater" }),
    limits_memory: z.string(),
    limits_memory_swap: z.string(),
    limits_memory_swappiness: z.number().int().min(0).max(100, { message: "Memory swappiness must be between 0 and 100" }),
    limits_memory_reservation: z.string(),
    limits_cpus: z.string(),
    limits_cpuset: z.string().nullable().optional(),
    limits_cpu_shares: z.number().int().positive({ message: "CPU shares must be a positive number" }),
    status: z.string().min(1, { message: "Application status is required" }),
    preview_url_template: z.string(),
    destination_type: z.string().min(1, { message: "Destination type is required" }),
    destination_id: z.number().int().positive({ message: "Destination ID must be a positive integer" }),
    source_id: z.number().int().positive({ message: "Source ID must be a positive integer" }),
    source_type: z.string().min(1, { message: "Source type is required" }),
    environment_id: z.number().int().positive({ message: "Environment ID must be a positive integer" }),
    created_at: z.string().datetime({ message: "Created at must be a valid datetime" }),
    updated_at: z.string().datetime({ message: "Updated at must be a valid datetime" })
});

/**
 * Response schema for listing applications
 */
const ListApplicationsResponseSchema = z.array(ApplicationSchema);

/**
 * GET /applications - List all applications
 */
export class ListApplicationsRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof ListApplicationsResponseSchema>> = {
        method: 'GET' as const,
        path: '/applications',
        responseSchema: ListApplicationsResponseSchema
    };

    /**
     * List all applications
     * @returns Promise containing array of applications
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}

// Export types for external use
export type Application = z.infer<typeof ApplicationSchema>;
export type ListApplicationsResponse = z.infer<typeof ListApplicationsResponseSchema>;
