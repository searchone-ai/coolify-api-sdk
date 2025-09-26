import { z } from 'zod';
import { BaseRoute } from '../../../../../core/route-interface.js';
import { EnvironmentVariableSchema, BulkEnvironmentVariablesSchema, UuidSchema } from '../../../schemas.js';

/**
 * POST /applications/{uuid}/envs/bulk - Create multiple environment variables for application
 */
export class CreateBulkApplicationEnvironmentVariablesRoute extends BaseRoute {
    private readonly config = {
        method: 'POST' as const,
        path: '/applications/{uuid}/envs/bulk',
        paramsSchema: z.object({
            uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" })
        }),
        bodySchema: BulkEnvironmentVariablesSchema,
        responseSchema: z.array(EnvironmentVariableSchema)
    };

    /**
     * Create multiple environment variables for an application
     * @param input - Request parameters and body containing application UUID and environment variables
     * @returns Promise containing array of created environment variables
     */
    async execute(input: {
        params: { uuid: string };
        body: z.infer<typeof BulkEnvironmentVariablesSchema>;
    }) {
        return this.executeRoute(this.config, input);
    }
}
