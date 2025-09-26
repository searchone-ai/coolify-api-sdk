import { describe, it, expect, beforeEach } from 'vitest';
import { ListApplicationsRoute } from '../../../src/routes/applications/GET.js';
import { MockHttpClient, loadMockData } from '../../utils/test-helpers.js';

describe('ListApplicationsRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: ListApplicationsRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new ListApplicationsRoute(mockHttpClient);
        mockData = await loadMockData('applications');
    });

    describe('execute', () => {
        it('should successfully list applications', async () => {
            // Arrange
            const expectedApplications = [mockData.validApplication];
            mockHttpClient.setMockResponse('GET', '/applications', expectedApplications);

            // Act
            const result = await route.execute();

            // Assert
            expect(result.data).toEqual(expectedApplications);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('GET');
            expect(lastRequest.path).toBe('/applications');
        });

        it('should handle empty applications list', async () => {
            // Arrange
            mockHttpClient.setMockResponse('GET', '/applications', []);

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
                    name: '',
                    // Missing required fields
                }
            ];
            mockHttpClient.setMockResponse('GET', '/applications', invalidResponse);

            // Act & Assert
            await expect(route.execute()).rejects.toThrow();
        });

        it('should handle HTTP errors', async () => {
            // Arrange
            const error = new Error('Network error');
            mockHttpClient.setMockResponse('GET', '/applications', { error });

            // Act & Assert
            await expect(route.execute()).rejects.toThrow('Network error');
        });
    });
});
