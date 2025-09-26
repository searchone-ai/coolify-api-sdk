import { describe, it, expect, beforeEach } from 'vitest';
import { CreatePostgreSQLDatabaseRoute } from '../../../../src/routes/databases/postgresql/POST.js';
import { MockHttpClient, loadMockData, assertValidationError } from '../../../utils/test-helpers.js';

describe('CreatePostgreSQLDatabaseRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: CreatePostgreSQLDatabaseRoute;
    let mockData: any;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new CreatePostgreSQLDatabaseRoute(mockHttpClient);
        mockData = await loadMockData('databases');
    });

    describe('execute', () => {
        it('should successfully create a PostgreSQL database', async () => {
            // Arrange
            const requestBody = mockData.validCreatePostgreSQLRequest;
            const expectedResponse = mockData.validDatabase;
            mockHttpClient.setMockResponse('POST', '/databases/postgresql', { data: expectedResponse, status: 200 });

            // Act
            const result = await route.execute({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe('/databases/postgresql');
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
                ...mockData.validCreatePostgreSQLRequest,
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
                ...mockData.validCreatePostgreSQLRequest,
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
                ...mockData.validCreatePostgreSQLRequest,
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

        it('should validate database_name is not empty', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
                database_name: ''
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Database name is required and cannot be empty']);
            }
        });

        it('should validate database_user is not empty', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
                database_user: ''
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Database user is required and cannot be empty']);
            }
        });

        it('should validate database_password minimum length', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
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

        it('should validate public_port range', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
                public_port: 70000
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Public port must be between 1 and 65535']);
            }
        });

        it('should validate limits_memory_swappiness range', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
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

        it('should validate limits_cpu_shares is positive', async () => {
            // Arrange
            const invalidRequest = {
                ...mockData.validCreatePostgreSQLRequest,
                limits_cpu_shares: -1
            };

            // Act & Assert
            try {
                await route.execute({ body: invalidRequest });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['CPU shares must be a positive number']);
            }
        });

        it('should accept valid optional fields', async () => {
            // Arrange
            const requestWithOptionals = {
                ...mockData.validCreatePostgreSQLRequest,
                name: 'My Custom Database',
                description: 'A custom PostgreSQL database',
                image: 'postgres:14',
                public_port: 5432,
                is_public: true,
                configuration: 'max_connections=200',
                limits_memory: '2g',
                limits_cpus: '1.0'
            };
            const expectedResponse = mockData.validDatabase;
            mockHttpClient.setMockResponse('POST', '/databases/postgresql', expectedResponse);

            // Act
            const result = await route.execute({ body: requestWithOptionals });

            // Assert
            expect(result.data).toEqual(expectedResponse);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.body).toEqual(requestWithOptionals);
        });

        it('should handle database creation errors', async () => {
            // Arrange
            const requestBody = mockData.validCreatePostgreSQLRequest;
            const error = new Error('Database creation failed');
            mockHttpClient.setMockResponse('POST', '/databases/postgresql', { error });

            // Act & Assert
            await expect(route.execute({ body: requestBody })).rejects.toThrow('Database creation failed');
        });
    });
});
