import { describe, it, expect, beforeEach } from 'vitest';
import { ListDeploymentsRoute } from '../../../src/routes/deployments/GET.js';
import { MockHttpClient, loadMockData } from '../../utils/test-helpers.js';

describe('ListDeploymentsRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: ListDeploymentsRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new ListDeploymentsRoute(mockHttpClient);
        mockData = await loadMockData('deployments');
    });

    describe('execute', () => {
        it('should successfully list deployments', async () => {
            // Arrange
            const expectedDeployments = [mockData.validDeployment];
            mockHttpClient.setMockResponse('GET', '/deployments', expectedDeployments);

            // Act
            const result = await route.execute();

            // Assert
            expect(result.data).toEqual(expectedDeployments);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('GET');
            expect(lastRequest.path).toBe('/deployments');
        });

        it('should handle empty deployments list', async () => {
            // Arrange
            mockHttpClient.setMockResponse('GET', '/deployments', []);

            // Act
            const result = await route.execute();

            // Assert
            expect(result.data).toEqual([]);
            expect(result.status).toBe(200);
        });

        it('should validate response schema', async () => {
            // Arrange
            const invalidResponse = [
                {
                    id: 'not-a-number',
                    uuid: 'invalid-uuid',
                    status: '',
                    // Missing required fields
                }
            ];
            mockHttpClient.setMockResponse('GET', '/deployments', invalidResponse);

            // Act & Assert
            await expect(route.execute()).rejects.toThrow();
        });

        it('should handle HTTP errors', async () => {
            // Arrange
            const error = new Error('Network error');
            mockHttpClient.setMockResponse('GET', '/deployments', { error });

            // Act & Assert
            await expect(route.execute()).rejects.toThrow('Network error');
        });

        it('should validate deployment schema fields', async () => {
            // Arrange
            const validDeployment = {
                ...mockData.validDeployment,
                id: 'not-a-number', // Should be number
                is_webhook: 'not-a-boolean', // Should be boolean
                pull_request_id: 'not-a-number' // Should be number
            };
            mockHttpClient.setMockResponse('GET', '/deployments', [validDeployment]);

            // Act & Assert
            await expect(route.execute()).rejects.toThrow();
        });

        it('should handle deployments with null optional fields', async () => {
            // Arrange
            const deploymentWithNulls = {
                ...mockData.validDeployment,
                application_id: null,
                application_name: null,
                server_name: null,
                commit: null,
                branch: null,
                pull_request_id: null
            };
            mockHttpClient.setMockResponse('GET', '/deployments', [deploymentWithNulls]);

            // Act
            const result = await route.execute();

            // Assert
            expect(result.data).toEqual([deploymentWithNulls]);
        });
    });
});
