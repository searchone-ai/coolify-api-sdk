import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { UuidSchema } from '../schemas.js';

/**
 * Create KeyDB database request schema
 */
const CreateKeyDBDatabaseBodySchema = z.object({
    project_uuid: UuidSchema.refine(val => val, { message: "Project UUID is required and must be a valid UUID" }),
    environment_name: z.string().min(1, { message: "Environment name is required and cannot be empty" }),
    server_uuid: UuidSchema.refine(val => val, { message: "Server UUID is required and must be a valid UUID" }),
    database_password: z.string().min(8, { message: "Database password must be at least 8 characters long" }),
    name: z.string().min(1, { message: "Service name is required" }).optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    public_port: z.number().int().min(1).max(65535, { message: "Public port must be between 1 and 65535" }).optional(),
    is_public: z.boolean().optional(),
    configuration: z.string().optional(),
    limits_memory: z.string().optional(),
    limits_memory_swap: z.string().optional(),
    limits_memory_swappiness: z.number().int().min(0).max(100, { message: "Memory swappiness must be between 0 and 100" }).optional(),
    limits_memory_reservation: z.string().optional(),
    limits_cpus: z.string().optional(),
    limits_cpuset: z.string().optional(),
    limits_cpu_shares: z.number().int().positive({ message: "CPU shares must be a positive number" }).optional()
}).transform(data => ({
    ...data,
    is_public: data.is_public ?? false
}));

/**
 * Database response schema
 */
const DatabaseResponseSchema = z.object({
    id: z.number().int().positive({ message: "Database ID must be a positive integer" }),
    uuid: UuidSchema,
    name: z.string().min(1, { message: "Database name is required and cannot be empty" }),
    description: z.string().nullable().optional(),
    image: z.string().min(1, { message: "Database image is required" }),
    status: z.string().min(1, { message: "Database status is required" }),
    database_name: z.string().min(1, { message: "Database name is required" }),
    database_user: z.string().min(1, { message: "Database user is required" }),
    database_password: z.string().min(1, { message: "Database password is required" }),
    root_password: z.string().nullable().optional(),
    version: z.string().min(1, { message: "Database version is required" }),
    public_port: z.number().int().min(1).max(65535, { message: "Public port must be between 1 and 65535" }).nullable().optional(),
    is_public: z.boolean(),
    configuration: z.string().nullable().optional(),
    server_ip: z.string().ip({ message: "Server IP must be a valid IP address" }).nullable().optional(),
    created_at: z.string().datetime({ message: "Created at must be a valid datetime" }),
    updated_at: z.string().datetime({ message: "Updated at must be a valid datetime" }),
    environment_id: z.number().int().positive({ message: "Environment ID must be a positive integer" }),
    destination_id: z.number().int().positive({ message: "Destination ID must be a positive integer" }),
    destination_type: z.string().min(1, { message: "Destination type is required" })
});

/**
 * POST /databases/keydb - Create new KeyDB database
 */
export class CreateKeyDBDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        {},
        {},
        z.infer<typeof CreateKeyDBDatabaseBodySchema>,
        z.infer<typeof DatabaseResponseSchema>
    > = {
            method: 'POST' as const,
            path: '/databases/keydb',
            bodySchema: CreateKeyDBDatabaseBodySchema,
            responseSchema: DatabaseResponseSchema
        };

    /**
     * Create a new KeyDB database
     * @param input - Database creation data
     * @returns Promise containing the created database
     */
    async execute(input: { body: z.infer<typeof CreateKeyDBDatabaseBodySchema> }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type CreateKeyDBDatabaseBody = z.infer<typeof CreateKeyDBDatabaseBodySchema>;
export type DatabaseResponse = z.infer<typeof DatabaseResponseSchema>;
