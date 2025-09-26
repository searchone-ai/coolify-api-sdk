import { z } from 'zod';

/**
 * UUID validation schema with custom error message
 */
export const UuidSchema = z.string().uuid({
    message: "Must be a valid UUID format"
});

/**
 * Deployment schema based on OpenAPI spec
 */
export const DeploymentSchema = z.object({
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
 * Deploy by tag request schema
 */
export const DeployByTagSchema = z.object({
    tag: z.string().min(1, { message: "Tag is required and cannot be empty" }),
    force: z.boolean().optional()
}).transform(data => ({
    ...data,
    force: data.force ?? false
}));

/**
 * Deploy application request schema
 */
export const DeployApplicationSchema = z.object({
    force: z.boolean().optional(),
    instant_deploy: z.boolean().optional(),
    git_type: z.enum(['github', 'gitlab', 'bitbucket', 'gitea'], {
        errorMap: () => ({ message: "Git type must be one of: github, gitlab, bitbucket, gitea" })
    }).optional(),
    commit_sha: z.string().optional(),
    pull_request_id: z.number().int().positive({ message: "Pull request ID must be a positive integer" }).optional()
}).transform(data => ({
    ...data,
    force: data.force ?? false,
    instant_deploy: data.instant_deploy ?? false
}));

export type Deployment = z.infer<typeof DeploymentSchema>;
export type DeployByTag = z.infer<typeof DeployByTagSchema>;
export type DeployApplication = z.infer<typeof DeployApplicationSchema>;
