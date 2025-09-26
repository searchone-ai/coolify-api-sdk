import { describe, it, expect, beforeEach } from 'vitest';
import { CreateRedisDatabaseRoute } from '../../../../src/routes/databases/redis/POST.js';
import { MockHttpClient, loadMockData, assertValidationError } from '../../../utils/test-helpers.js';

describe('CreateRedisDatabaseRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: CreateRedisDatabaseRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new CreateRedisDatabaseRoute(mockHttpClient);
        mockData = await loadMockData('databases');
    });

    describe('execute', () => {
        it('should successfully create a Redis database', async () => {
            // Arrange
            const requestBody = mockData.validCreateRedisRequest;
            const expectedResponse = mockData.validDatabase;
            mockHttpClient.setMockResponse('POST', '/databases/redis', { data: expectedResponse, status: 200 });

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe('/databases/redis');
            expect(lastRequest.body).toEqual({
                ...requestBody,
                is_public: false // Default value added by Zod schema
            });
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
                ...mockData.validCreateRedisRequest,
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
                ...mockData.validCreateRedisRequest,
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
                ...mockData.validCreateRedisRequest,
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

        it('should validate database_password minimum length', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreateRedisRequest,
                database_password: 'short'
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Database password must be at least 8 characters long']);
            }
        });

        it('should not require database_name and database_user for Redis', async () => {
            // Arrange
            const requestBody = mockData.validCreateRedisRequest;
            const expectedResponse = mockData.validDatabase;
            mockHttpClient.setMockResponse('POST', '/databases/redis', expectedResponse);

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body).not.toHaveProperty('database_name');
            expect(lastRequest.body).not.toHaveProperty('database_user');
        });

        it('should accept valid optional fields', async () => {
            // Arrange
            const requestWithOptionals = {
                ...mockData.validCreateRedisRequest,
                name: 'My Redis Cache',
                description: 'A Redis cache database',
                image: 'redis:7-alpine',
                public_port: 6379,
                is_public: false,
                configuration: 'maxmemory 256mb',
                limits_memory: '512m'
            };
            const expectedResponse = mockData.validDatabase;
            mockHttpClient.setMockResponse('POST', '/databases/redis', expectedResponse);

            // Act
            const result = await route.execute({ body: requestWithOptionals });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body).toEqual(requestWithOptionals);
        });

        it('should handle database creation errors', async () => {
            // Arrange
            const requestBody = mockData.validCreateRedisRequest;
            const error = new Error('Redis database creation failed');
            mockHttpClient.setMockResponse('POST', '/databases/redis', { error });

            // Act & Assert
            await expect(route.execute({ body: requestBody })).rejects.toThrow('Redis database creation failed');
        });
    });
});
