import { describe, it, expect, beforeEach } from 'vitest';
import { DeployByTagRoute } from '../../../src/routes/deploy/POST.js';
import { MockHttpClient, loadMockData, assertValidationError } from '../../utils/test-helpers.js';

describe('DeployByTagRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: DeployByTagRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new DeployByTagRoute(mockHttpClient);
        mockData = await loadMockData('deployments');
    });

    describe('execute', () => {
        it('should successfully deploy by tag', async () => {
            // Arrange
            const requestBody = mockData.validDeployByTagRequest;
            const expectedResponse = { success: true, message: 'Deployment started' };
            mockHttpClient.setMockResponse('POST', '/deploy', expectedResponse);

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe('/deploy');
            expect(lastRequest.body).toEqual(requestBody);
        });

        it('should validate required tag field', async () => {
            // Arrange
            const invalidRequest = {
                force: false
                // Missing tag
            };

            // Act & Assert
            await expect(route.execute({ body: invalidRequest })).rejects.toThrow();
        });

        it('should validate tag is not empty', async () => {
            // Arrange
            const invalidRequest = {
                tag: '',
                force: false
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Tag is required and cannot be empty']);
            }
        });

        it('should use default value for force field', async () => {
            // Arrange
            const requestBody = {
                tag: 'v1.0.0'
                // force should default to false
            };
            const expectedResponse = { success: true, message: 'Deployment started' };
            mockHttpClient.setMockResponse('POST', '/deploy', expectedResponse);

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body.force).toBe(false);
        });

        it('should accept explicit force value', async () => {
            // Arrange
            const requestBody = {
                tag: 'v1.0.0',
                force: true
            };
            const expectedResponse = { success: true, message: 'Deployment started' };
            mockHttpClient.setMockResponse('POST', '/deploy', expectedResponse);

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body.force).toBe(true);
        });

        it('should validate force field type', async () => {
            // Arrange
            const invalidRequest = {
                tag: 'v1.0.0',
                force: 'not-a-boolean'
            };

            // Act & Assert
            await expect(route.execute({ body: invalidRequest })).rejects.toThrow();
        });

        it('should handle deployment errors', async () => {
            // Arrange
            const requestBody = mockData.validDeployByTagRequest;
            const error = new Error('Deployment failed');
            mockHttpClient.setMockResponse('POST', '/deploy', { error });

            // Act & Assert
            await expect(route.execute({ body: requestBody })).rejects.toThrow('Deployment failed');
        });

        it('should handle tag not found', async () => {
            // Arrange
            const requestBody = {
                tag: 'non-existent-tag',
                force: false
            };
            const expectedResponse = { success: false, message: 'Tag not found' };
            mockHttpClient.setMockResponse('POST', '/deploy', expectedResponse);

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.data.success).toBe(false);
        });
    });
});
