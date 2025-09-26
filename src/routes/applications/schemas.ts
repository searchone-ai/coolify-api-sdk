import { z } from 'zod';

/**
 * UUID validation schema with custom error message
 */
export const UuidSchema = z.string().uuid({
    message: "Must be a valid UUID format"
});

/**
 * Build pack enum schema
 */
export const BuildPackSchema = z.enum(['nixpacks', 'static', 'dockerfile', 'dockercompose'], {
    errorMap: () => ({ message: "Build pack must be one of: nixpacks, static, dockerfile, dockercompose" })
});

/**
 * Application schema based on OpenAPI spec
 */
export const ApplicationSchema = z.object({
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
 * Create public application request schema
 */
export const CreatePublicApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    git_repository: z.string().url({ message: "Git repository must be a valid URL" }),
    git_branch: z.string().min(1, { message: "Git branch is required and cannot be empty" }),
    build_pack: BuildPackSchema,
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
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
 * Create private GitHub app application request schema
 */
export const CreatePrivateGithubAppApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    git_repository: z.string().url({ message: "Git repository must be a valid URL" }),
    git_branch: z.string().min(1, { message: "Git branch is required and cannot be empty" }),
    build_pack: BuildPackSchema,
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    github_app_uuid: UuidSchema.refine(val => val, { message: "GitHub App UUID is required and must be a valid UUID" }),
    // All the same optional fields as public
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
 * Create private deploy key application request schema
 */
export const CreatePrivateDeployKeyApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    git_repository: z.string().url({ message: "Git repository must be a valid URL" }),
    git_branch: z.string().min(1, { message: "Git branch is required and cannot be empty" }),
    build_pack: BuildPackSchema,
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    private_key_uuid: UuidSchema.refine(val => val, { message: "Private key UUID is required and must be a valid UUID" }),
    // All the same optional fields as public
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
 * Create dockerfile application request schema
 */
export const CreateDockerfileApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    dockerfile: z.string().min(1, { message: "Dockerfile content is required" }),
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    // Optional fields
    name: z.string().min(1, { message: "Application name is required" }).optional(),
    description: z.string().optional(),
    domains: z.string().optional(),
    docker_registry_image_name: z.string().optional(),
    docker_registry_image_tag: z.string().optional(),
    ports_mappings: z.string().optional(),
    base_directory: z.string().optional(),
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
 * Create docker image application request schema
 */
export const CreateDockerImageApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    docker_registry_image_name: z.string().min(1, { message: "Docker registry image name is required" }),
    docker_registry_image_tag: z.string().min(1, { message: "Docker registry image tag is required" }),
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    // Optional fields
    name: z.string().min(1, { message: "Application name is required" }).optional(),
    description: z.string().optional(),
    domains: z.string().optional(),
    ports_mappings: z.string().optional(),
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
 * Create docker compose application request schema
 */
export const CreateDockerComposeApplicationSchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    environment_uuid: UuidSchema.refine(val => val, { message: "Environment UUID is required and must be a valid UUID" }),
    docker_compose_raw: z.string().min(1, { message: "Docker compose content is required" }),
    ports_exposes: z.string().min(1, { message: "Ports to expose are required" }),
    // Optional fields
    name: z.string().min(1, { message: "Application name is required" }).optional(),
    description: z.string().optional(),
    domains: z.string().optional(),
    ports_mappings: z.string().optional(),
    base_directory: z.string().optional(),
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
 * Environment variable schema
 */
export const EnvironmentVariableSchema = z.object({
    id: z.number().int().positive({ message: "Environment variable ID must be a positive integer" }),
    uuid: UuidSchema,
    key: z.string().min(1, { message: "Environment variable key is required and cannot be empty" }),
    value: z.string(),
    is_preview: z.boolean(),
    is_build_time: z.boolean(),
    is_literal: z.boolean(),
    application_id: z.number().int().positive({ message: "Application ID must be a positive integer" }),
    created_at: z.string().datetime({ message: "Created at must be a valid datetime" }),
    updated_at: z.string().datetime({ message: "Updated at must be a valid datetime" })
});

/**
 * Create/Update environment variable schema
 */
export const CreateEnvironmentVariableSchema = z.object({
    key: z.string().min(1, { message: "Environment variable key is required and cannot be empty" }),
    value: z.string(),
    is_preview: z.boolean().optional(),
    is_build_time: z.boolean().optional(),
    is_literal: z.boolean().optional()
}).transform(data => ({
    ...data,
    is_preview: data.is_preview ?? false,
    is_build_time: data.is_build_time ?? false,
    is_literal: data.is_literal ?? false
}));

/**
 * Bulk environment variables schema
 */
export const BulkEnvironmentVariablesSchema = z.array(CreateEnvironmentVariableSchema).min(1, {
    message: "At least one environment variable is required"
});

/**
 * Application logs response schema
 */
export const ApplicationLogsSchema = z.object({
    logs: z.string()
});

export type Application = z.infer<typeof ApplicationSchema>;
export type CreatePublicApplication = z.infer<typeof CreatePublicApplicationSchema>;
export type CreatePrivateGithubAppApplication = z.infer<typeof CreatePrivateGithubAppApplicationSchema>;
export type CreatePrivateDeployKeyApplication = z.infer<typeof CreatePrivateDeployKeyApplicationSchema>;
export type CreateDockerfileApplication = z.infer<typeof CreateDockerfileApplicationSchema>;
export type CreateDockerImageApplication = z.infer<typeof CreateDockerImageApplicationSchema>;
export type CreateDockerComposeApplication = z.infer<typeof CreateDockerComposeApplicationSchema>;
export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>;
export type CreateEnvironmentVariable = z.infer<typeof CreateEnvironmentVariableSchema>;
export type BulkEnvironmentVariables = z.infer<typeof BulkEnvironmentVariablesSchema>;
export type ApplicationLogs = z.infer<typeof ApplicationLogsSchema>;
