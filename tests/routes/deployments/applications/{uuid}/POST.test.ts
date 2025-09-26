import { describe, it, expect, beforeEach } from 'vitest';
import { DeployApplicationRoute } from '../../../../../src/routes/deployments/applications/{uuid}/POST.js';
import { MockHttpClient, loadMockData, createTestUuid, assertValidationError } from '../../../../utils/test-helpers.js';

describe('DeployApplicationRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: DeployApplicationRoute;
    let mockData: any;
    let testUuid: string;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new DeployApplicationRoute(mockHttpClient);
        mockData = await loadMockData('deployments');
        testUuid = createTestUuid();
    });

    describe('execute', () => {
        it('should successfully deploy application', async () => {
            // Arrange
            const requestBody = mockData.validDeployApplicationRequest;
            const expectedResponse = { success: true, message: 'Application deployment started' };
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe(`/deployments/applications/${testUuid}`);
            expect(lastRequest.body).toEqual(requestBody);
        });

        it('should validate UUID parameter format', async () => {
            // Arrange
            const invalidUuid = 'invalid-uuid';
            const requestBody = mockData.validDeployApplicationRequest;

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: invalidUuid },
                    body: requestBody
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Must be a valid UUID format']);
            }
        });

        it('should use default values for boolean fields', async () => {
            // Arrange
            const requestBody = {
                // All boolean fields should default to false
            };
            const expectedResponse = { success: true, message: 'Application deployment started' };
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body.force).toBe(false);
            expect(lastRequest.body.instant_deploy).toBe(false);
        });

        it('should accept explicit boolean values', async () => {
            // Arrange
            const requestBody = {
                force: true,
                instant_deploy: true
            };
            const expectedResponse = { success: true, message: 'Application deployment started' };
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body.force).toBe(true);
            expect(lastRequest.body.instant_deploy).toBe(true);
        });

        it('should validate git_type enum', async () => {
            // Arrange
            const invalidRequest = {
                git_type: 'invalid-git-type'
            };

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: invalidRequest
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Git type must be one of: github, gitlab, bitbucket, gitea']);
            }
        });

        it('should validate pull_request_id is positive', async () => {
            // Arrange
            const invalidRequest = {
                pull_request_id: -1
            };

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: invalidRequest
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Pull request ID must be a positive integer']);
            }
        });

        it('should accept valid optional fields', async () => {
            // Arrange
            const requestBody = {
                force: false,
                instant_deploy: true,
                git_type: 'github',
                commit_sha: 'a1b2c3d4e5f6',
                pull_request_id: 123
            };
            const expectedResponse = { success: true, message: 'Application deployment started' };
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body).toEqual(requestBody);
        });

        it('should handle application not found', async () => {
            // Arrange
            const requestBody = mockData.validDeployApplicationRequest;
            const error = new Error('Application not found');
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, { error });

            // Act & Assert
            await expect(route.execute({
                params: { uuid: testUuid },
                body: requestBody
            })).rejects.toThrow('Application not found');
        });

        it('should handle deployment already in progress', async () => {
            // Arrange
            const requestBody = mockData.validDeployApplicationRequest;
            const expectedResponse = { success: false, message: 'Deployment already in progress' };
            mockHttpClient.setMockResponse('POST', `/deployments/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.data.success).toBe(false);
        });

        it('should validate force field type', async () => {
            // Arrange
            const invalidRequest = {
                force: 'not-a-boolean'
            };

            // Act & Assert
            await expect(route.execute({
                params: { uuid: testUuid },
                body: invalidRequest
            })).rejects.toThrow();
        });

        it('should validate instant_deploy field type', async () => {
            // Arrange
            const invalidRequest = {
                instant_deploy: 'not-a-boolean'
            };

            // Act & Assert
            await expect(route.execute({
                params: { uuid: testUuid },
                body: invalidRequest
            })).rejects.toThrow();
        });
    });
});
