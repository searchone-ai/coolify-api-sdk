import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../core/route-interface.js';
import { UuidSchema } from './schemas.js';

/**
 * Database schema for list response
 */
const DatabaseSchema = z.object({
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
 * Response schema for listing databases
 */
const ListDatabasesResponseSchema = z.array(DatabaseSchema);

/**
 * GET /databases - List all databases
 */
export class ListDatabasesRoute extends BaseRoute {
    private readonly config: RouteConfig<{}, {}, {}, z.infer<typeof ListDatabasesResponseSchema>> = {
        method: 'GET' as const,
        path: '/databases',
        responseSchema: ListDatabasesResponseSchema
    };

    /**
     * List all databases
     * @returns Promise containing array of databases
     */
    async execute() {
        return this.executeRoute(this.config);
    }
}

// Export types for external use
export type Database = z.infer<typeof DatabaseSchema>;
export type ListDatabasesResponse = z.infer<typeof ListDatabasesResponseSchema>;
