import { describe, it, expect, beforeEach } from 'vitest';
import { ListDatabasesRoute } from '../../../src/routes/databases/GET.js';
import { MockHttpClient, loadMockData } from '../../utils/test-helpers.js';

describe('ListDatabasesRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: ListDatabasesRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new ListDatabasesRoute(mockHttpClient);
        mockData = await loadMockData('databases');
    });

    describe('execute', () => {
        it('should successfully list databases', async () => {
            // Arrange
            const expectedDatabases = [mockData.validDatabase];
            mockHttpClient.setMockResponse('GET', '/databases', expectedDatabases);

            // Act
            const result = await route.execute();

            // Assert
            expect(result.data).toEqual(expectedDatabases);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('GET');
            expect(lastRequest.path).toBe('/databases');
        });

        it('should handle empty databases list', async () => {
            // Arrange
            mockHttpClient.setMockResponse('GET', '/databases', []);

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
            mockHttpClient.setMockResponse('GET', '/databases', invalidResponse);

            // Act & Assert
            await expect(route.execute()).rejects.toThrow();
        });

        it('should handle HTTP errors', async () => {
            // Arrange
            const error = new Error('Network error');
            mockHttpClient.setMockResponse('GET', '/databases', { error });

            // Act & Assert
            await expect(route.execute()).rejects.toThrow('Network error');
        });

        it('should validate database schema fields', async () => {
            // Arrange
            const validDatabase = {
                ...mockData.validDatabase,
                public_port: 'not-a-number', // Should be number
                is_public: 'not-a-boolean', // Should be boolean
                server_ip: 'invalid-ip' // Should be valid IP
            };
            mockHttpClient.setMockResponse('GET', '/databases', [validDatabase]);

            // Act & Assert
            await expect(route.execute()).rejects.toThrow();
        });
    });
});
