import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../core/route-interface.js';
import { UuidSchema } from '../schemas.js';

/**
 * Request parameters schema
 */
const GetDatabaseParamsSchema = z.object({
    uuid: UuidSchema.refine(val => val, { message: "Database UUID is required and must be a valid UUID" })
});

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
 * GET /databases/{uuid} - Get database by UUID
 */
export class GetDatabaseRoute extends BaseRoute {
    private readonly config: RouteConfig<
        z.infer<typeof GetDatabaseParamsSchema>,
        {},
        {},
        z.infer<typeof DatabaseResponseSchema>
    > = {
            method: 'GET' as const,
            path: '/databases/{uuid}',
            paramsSchema: GetDatabaseParamsSchema,
            responseSchema: DatabaseResponseSchema
        };

    /**
     * Get database by UUID
     * @param input - Request parameters containing database UUID
     * @returns Promise containing the database
     */
    async execute(input: { params: { uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}

// Export types for external use
export type GetDatabaseParams = z.infer<typeof GetDatabaseParamsSchema>;
export type DatabaseResponse = z.infer<typeof DatabaseResponseSchema>;
