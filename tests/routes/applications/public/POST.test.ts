import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePublicApplicationRoute } from '../../../../src/routes/applications/public/POST.js';
import { MockHttpClient, loadMockData, assertValidationError } from '../../../utils/test-helpers.js';

describe('CreatePublicApplicationRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: CreatePublicApplicationRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new CreatePublicApplicationRoute(mockHttpClient);
        mockData = await loadMockData('applications');
    });

    describe('execute', () => {
        it('should successfully create a public application', async () => {
            // Arrange
            const requestBody = mockData.validCreatePublicRequest;
            const expectedResponse = mockData.validApplication;
            mockHttpClient.setMockResponse('POST', '/applications/public', { data: expectedResponse, status: 200 });

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe('/applications/public');
            expect(lastRequest.body).toEqual(requestBody);
        });

        it('should validate required fields', async () => {
            // Arrange
            const invalidRequest = {
                // Missing all required fields
            };

            // Act & Assert
            await expect(route.execute({ body: invalidRequest })).rejects.toThrow();
        });

        it('should validate project_uuid format', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                project_uuid: 'invalid-uuid'
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Must be a valid UUID format']);
            }
        });

        it('should validate server_uuid format', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                server_uuid: 'not-a-uuid'
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Must be a valid UUID format']);
            }
        });

        it('should validate environment_name is not empty', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                environment_name: ''
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Environment name is required and cannot be empty']);
            }
        });

        it('should validate git_repository is a valid URL', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                git_repository: 'not-a-url'
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Git repository must be a valid URL']);
            }
        });

        it('should validate git_branch is not empty', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                git_branch: ''
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Git branch is required and cannot be empty']);
            }
        });

        it('should validate build_pack enum', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                build_pack: 'invalid-pack'
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Build pack must be one of: nixpacks, static, dockerfile, dockercompose']);
            }
        });

        it('should validate ports_exposes is not empty', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                ports_exposes: ''
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Ports to expose are required']);
            }
        });

        it('should validate health_check_return_code range', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                health_check_return_code: 999
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Health check return code must be a valid HTTP status code (100-599)']);
            }
        });

        it('should validate limits_memory_swappiness range', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePublicRequest,
                limits_memory_swappiness: 150
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Memory swappiness must be between 0 and 100']);
            }
        });

        it('should accept valid optional fields', async () => {
            // Arrange
            const requestWithOptionals = {
                ...mockData.validCreatePublicRequest,
                name: 'My Custom App',
                description: 'A custom application',
                health_check_enabled: true,
                health_check_interval: 60,
                limits_memory: '1g'
            };
            const expectedResponse = mockData.validApplication;
            mockHttpClient.setMockResponse('POST', '/applications/public', expectedResponse);

            // Act
            const result = await route.execute({ body: requestWithOptionals });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body).toEqual(requestWithOptionals);
        });
    });
});
