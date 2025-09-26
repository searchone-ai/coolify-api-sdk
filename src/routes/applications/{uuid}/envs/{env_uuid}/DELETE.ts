import { z } from 'zod';
import { BaseRoute, RouteConfig } from '../../../../../core/route-interface.js';
import { UuidSchema } from '../../../schemas.js';
import { BaseResponseSchema } from '../../../../../core/types.js';

/**
 * DELETE /applications/{uuid}/envs/{env_uuid} - Delete specific environment variable
 */
export class DeleteApplicationEnvironmentVariableRoute extends BaseRoute {
    private readonly config: RouteConfig<
        { uuid: string; env_uuid: string },
        {},
        {},
        z.infer<typeof BaseResponseSchema>
    > = {
            method: 'DELETE',
            path: '/applications/{uuid}/envs/{env_uuid}',
            paramsSchema: z.object({
                uuid: UuidSchema.refine(val => val, { message: "Application UUID is required and must be a valid UUID" }),
                env_uuid: UuidSchema.refine(val => val, { message: "Environment variable UUID is required and must be a valid UUID" })
            }),
            responseSchema: BaseResponseSchema
        };

    /**
     * Delete specific environment variable by UUIDs
     * @param input - Request parameters containing application UUID and environment variable UUID
     * @returns Promise containing the deletion response
     */
    async execute(input: { params: { uuid: string; env_uuid: string } }) {
        return this.executeRoute(this.config, input);
    }
}
