import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePrivateGithubAppApplicationRoute } from '../../../../src/routes/applications/private-github-app/POST.js';
import { CreatePrivateGithubAppApplicationSchema, ApplicationSchema } from '../../../../src/routes/applications/schemas.js';
import { MockHttpClient, loadMockData } from '../../../utils/test-helpers.js';

describe('CreatePrivateGithubAppApplicationRoute', () => {
    let route: CreatePrivateGithubAppApplicationRoute;
    let mockClient: MockHttpClient;
    let mockData: any;

    beforeEach(async () => {
        mockClient = new MockHttpClient();
        route = new CreatePrivateGithubAppApplicationRoute(mockClient);
        mockData = await loadMockData('applications');
    });

    describe('Schema Validation', () => {
        it('should validate a correct private GitHub app request', () => {
            const validRequest = mockData.validCreatePrivateGithubAppRequest;

            const result = CreatePrivateGithubAppApplicationSchema.safeParse(validRequest);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.git_repository).toBe('searchone-ai/mvp2-proxy');
                expect(result.data.github_app_uuid).toBe('g0sgcw408s848kkoggsgw0ss');
                expect(result.data.project_uuid).toBe('p0sgcw408s848kkoggsgw0ss');
                expect(result.data.server_uuid).toBe('s0sgcw408s848kkoggsgw0ss');
                expect(result.data.environment_uuid).toBe('e0sgcw408s848kkoggsgw0ss');
                expect(result.data.environment_name).toBe('production');
                expect(result.data.git_branch).toBe('main');
                expect(result.data.build_pack).toBe('nixpacks');
                expect(result.data.ports_exposes).toBe('3000');
            }
        });

        it('should reject invalid private GitHub app request', () => {
            const invalidRequest = mockData.invalidCreatePrivateGithubAppRequest;

            const result = CreatePrivateGithubAppApplicationSchema.safeParse(invalidRequest);

            expect(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.errors;
                expect(errors.some(e => e.path.includes('project_uuid'))).toBe(true);
                expect(errors.some(e => e.path.includes('server_uuid'))).toBe(true);
                expect(errors.some(e => e.path.includes('environment_name'))).toBe(true);
                expect(errors.some(e => e.path.includes('environment_uuid'))).toBe(true);
                expect(errors.some(e => e.path.includes('git_repository'))).toBe(true);
                expect(errors.some(e => e.path.includes('git_branch'))).toBe(true);
                expect(errors.some(e => e.path.includes('build_pack'))).toBe(true);
                expect(errors.some(e => e.path.includes('ports_exposes'))).toBe(true);
                expect(errors.some(e => e.path.includes('github_app_uuid'))).toBe(true);
            }
        });

        describe('Repository Format Validation', () => {
            it('should accept valid owner/repo format', () => {
                const validFormats = [
                    'searchone-ai/mvp2-proxy',
                    'user/repo',
                    'org-name/project-name',
                    'user123/repo456',
                    'my.org/my.repo',
                    'my_org/my_repo'
                ];

                validFormats.forEach(repo => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        git_repository: repo
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(true);
                });
            });

            it('should reject invalid repository formats', () => {
                const invalidFormats = [
                    'https://github.com/user/repo.git',
                    'git@github.com:user/repo.git',
                    'user',
                    'user/',
                    '/repo',
                    'user/repo/extra',
                    'user repo',
                    'user@repo',
                    ''
                ];

                invalidFormats.forEach(repo => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        git_repository: repo
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(false);
                    if (!result.success) {
                        expect(result.error.errors.some(e =>
                            e.path.includes('git_repository') &&
                            e.message.includes('owner/repo format')
                        )).toBe(true);
                    }
                });
            });
        });

        describe('UUID Validation', () => {
            it('should validate all required UUIDs', () => {
                const validUuids = [
                    'p0sgcw408s848kkoggsgw0ss',
                    'abcdef1234567890abcdef12',
                    '123456789012345678901234'
                ];

                validUuids.forEach(uuid => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        project_uuid: uuid,
                        server_uuid: uuid,
                        environment_uuid: uuid,
                        github_app_uuid: uuid
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(true);
                });
            });

            it('should reject invalid UUIDs', () => {
                const invalidUuids = [
                    'invalid-uuid',
                    '550e8400-e29b-41d4-a716-446655440001', // Standard UUID format
                    'short',
                    'toolongtobeavaliduuidformat123456789',
                    'UPPERCASE123456789012345',
                    ''
                ];

                invalidUuids.forEach(uuid => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        project_uuid: uuid
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(false);
                });
            });
        });

        describe('Build Pack Validation', () => {
            it('should accept valid build packs', () => {
                const validBuildPacks = ['nixpacks', 'static', 'dockerfile', 'dockercompose'];

                validBuildPacks.forEach(buildPack => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        build_pack: buildPack
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(true);
                });
            });

            it('should reject invalid build packs', () => {
                const invalidBuildPacks = ['invalid-pack', 'docker', 'npm', ''];

                invalidBuildPacks.forEach(buildPack => {
                    const request = {
                        ...mockData.validCreatePrivateGithubAppRequest,
                        build_pack: buildPack
                    };

                    const result = CreatePrivateGithubAppApplicationSchema.safeParse(request);
                    expect(result.success).toBe(false);
                });
            });
        });
    });

    describe('Route Execution', () => {
        it('should successfully create private GitHub app application', async () => {
            const mockApplication = mockData.validApplication;
            mockClient.setMockResponse('POST', '/applications/private-github-app', mockApplication);

            const input = {
                body: mockData.validCreatePrivateGithubAppRequest
            };

            const result = await route.execute(input);

            const lastRequest = mockClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe('/applications/private-github-app');
            expect(lastRequest.body).toEqual(mockData.validCreatePrivateGithubAppRequest);
            expect(result.data).toEqual(mockApplication);
        });

        it('should handle API errors gracefully', async () => {
            const apiError = new Error('GitHub App not found');
            mockClient.setMockResponse('POST', '/applications/private-github-app', { error: apiError });

            const input = {
                body: mockData.validCreatePrivateGithubAppRequest
            };

            await expect(route.execute(input)).rejects.toThrow('GitHub App not found');
        });

        it('should validate response schema', async () => {
            const invalidResponse = { invalid: 'response' };
            mockClient.setMockResponse('POST', '/applications/private-github-app', invalidResponse);

            const input = {
                body: mockData.validCreatePrivateGithubAppRequest
            };

            await expect(route.execute(input)).rejects.toThrow();
        });
    });

    describe('Route Configuration', () => {
        it('should have correct route configuration', () => {
            const config = (route as any).config;

            expect(config.method).toBe('POST');
            expect(config.path).toBe('/applications/private-github-app');
            expect(config.bodySchema).toBe(CreatePrivateGithubAppApplicationSchema);
            expect(config.responseSchema).toBe(ApplicationSchema);
        });
    });

    describe('Edge Cases', () => {
        it('should handle optional fields correctly', () => {
            const requestWithOptionals = {
                ...mockData.validCreatePrivateGithubAppRequest,
                name: 'Custom App Name',
                description: 'Custom description',
                domains: 'app.example.com',
                install_command: 'npm install',
                build_command: 'npm run build',
                start_command: 'npm start'
            };

            const result = CreatePrivateGithubAppApplicationSchema.safeParse(requestWithOptionals);
            expect(result.success).toBe(true);

            if (result.success) {
                expect(result.data.name).toBe('Custom App Name');
                expect(result.data.description).toBe('Custom description');
                expect(result.data.domains).toBe('app.example.com');
                expect(result.data.install_command).toBe('npm install');
                expect(result.data.build_command).toBe('npm run build');
                expect(result.data.start_command).toBe('npm start');
            }
        });

        it('should handle empty optional fields', () => {
            const requestWithEmptyOptionals = {
                ...mockData.validCreatePrivateGithubAppRequest,
                name: '',
                description: '',
                domains: ''
            };

            const result = CreatePrivateGithubAppApplicationSchema.safeParse(requestWithEmptyOptionals);
            // Empty name should fail validation
            expect(result.success).toBe(false);
        });

        it('should handle missing optional fields', () => {
            const minimalRequest = {
                project_uuid: mockData.validCreatePrivateGithubAppRequest.project_uuid,
                server_uuid: mockData.validCreatePrivateGithubAppRequest.server_uuid,
                environment_name: mockData.validCreatePrivateGithubAppRequest.environment_name,
                environment_uuid: mockData.validCreatePrivateGithubAppRequest.environment_uuid,
                git_repository: mockData.validCreatePrivateGithubAppRequest.git_repository,
                git_branch: mockData.validCreatePrivateGithubAppRequest.git_branch,
                build_pack: mockData.validCreatePrivateGithubAppRequest.build_pack,
                ports_exposes: mockData.validCreatePrivateGithubAppRequest.ports_exposes,
                github_app_uuid: mockData.validCreatePrivateGithubAppRequest.github_app_uuid
            };

            const result = CreatePrivateGithubAppApplicationSchema.safeParse(minimalRequest);
            expect(result.success).toBe(true);
        });
    });
});
