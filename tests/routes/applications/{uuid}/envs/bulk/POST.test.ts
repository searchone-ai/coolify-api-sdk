import { describe, it, expect, beforeEach } from 'vitest';
import { CreateBulkApplicationEnvironmentVariablesRoute } from '../../../../../../src/routes/applications/{uuid}/envs/bulk/POST.js';
import { MockHttpClient, loadMockData, createTestUuid, assertValidationError } from '../../../../../utils/test-helpers.js';

describe('CreateBulkApplicationEnvironmentVariablesRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: CreateBulkApplicationEnvironmentVariablesRoute;
    let mockData: any;
    let testUuid: string;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new CreateBulkApplicationEnvironmentVariablesRoute(mockHttpClient);
        mockData = await loadMockData('applications');
        testUuid = createTestUuid();
    });

    describe('execute', () => {
        it('should successfully create bulk environment variables', async () => {
            // Arrange
            const requestBody = mockData.validBulkEnvironmentVariables;
            const expectedResponse = [mockData.validEnvironmentVariable, mockData.validEnvironmentVariable];
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/envs/bulk`, expectedResponse);

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
            expect(lastRequest.path).toBe(`/applications/${testUuid}/envs/bulk`);
            expect(lastRequest.body).toEqual(requestBody);
        });

        it('should validate UUID parameter format', async () => {
            // Arrange
            const invalidUuid = 'invalid-uuid';
            const requestBody = mockData.validBulkEnvironmentVariables;

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

        it('should validate environment variables array is not empty', async () => {
            // Arrange
            const emptyArray: any[] = [];

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: emptyArray
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['At least one environment variable is required']);
            }
        });

        it('should validate environment variable key is not empty', async () => {
            // Arrange
            const invalidRequest = [
                {
                    key: '',
                    value: 'some-value'
                }
            ];

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: invalidRequest
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Environment variable key is required and cannot be empty']);
            }
        });

        it('should validate environment variable structure', async () => {
            // Arrange
            const invalidRequest = [
                {
                    // Missing key and value
                    is_preview: 'not-a-boolean'
                }
            ];

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: invalidRequest
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                expect(error.name).toBe('ZodError');
            }
        });

        it('should accept valid environment variables with all fields', async () => {
            // Arrange
            const requestBody = [
                {
                    key: 'NODE_ENV',
                    value: 'production',
                    is_preview: false,
                    is_build_time: true,
                    is_literal: false
                },
                {
                    key: 'API_URL',
                    value: 'https://api.example.com',
                    is_preview: true,
                    is_build_time: false,
                    is_literal: true
                }
            ];
            const expectedResponse = [mockData.validEnvironmentVariable, mockData.validEnvironmentVariable];
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/envs/bulk`, expectedResponse);

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

        it('should accept environment variables with default boolean values', async () => {
            // Arrange
            const requestBody = [
                {
                    key: 'SIMPLE_VAR',
                    value: 'simple-value'
                    // Boolean fields should default to false
                }
            ];
            const expectedResponse = [mockData.validEnvironmentVariable];
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/envs/bulk`, expectedResponse);

            // Act
            const result = await route.execute({
                params: { uuid: testUuid },
                body: requestBody
            });

            // Assert
            expect(result.data).toEqual(expectedResponse);
        });

        it('should validate multiple environment variables', async () => {
            // Arrange
            const requestBody = [
                {
                    key: 'VALID_VAR',
                    value: 'valid-value'
                },
                {
                    key: '', // Invalid: empty key
                    value: 'some-value'
                }
            ];

            // Act & Assert
            try {
                await route.execute({
                    params: { uuid: testUuid },
                    body: requestBody
                });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Environment variable key is required and cannot be empty']);
            }
        });
    });
});
