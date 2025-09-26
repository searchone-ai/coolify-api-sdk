import { describe, it, expect, beforeEach } from 'vitest';
import { StartApplicationRoute } from '../../../../../src/routes/applications/{uuid}/start/POST.js';
import { MockHttpClient, createTestUuid, assertValidationError } from '../../../../utils/test-helpers.js';

describe('StartApplicationRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: StartApplicationRoute;
    let testUuid: string;

    beforeEach(() => {
        mockHttpClient = new MockHttpClient();
        route = new StartApplicationRoute(mockHttpClient);
        testUuid = createTestUuid();
    });

    describe('execute', () => {
        it('should successfully start application', async () => {
            // Arrange
            const expectedResponse = { success: true, message: 'Application started successfully' };
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/start`, expectedResponse);

            // Act
            const result = await route.execute({ params: { uuid: testUuid } });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('POST');
            expect(lastRequest.path).toBe(`/applications/${testUuid}/start`);
            expect(lastRequest.body).toBeUndefined();
        });

        it('should validate UUID parameter format', async () => {
            // Arrange
            const invalidUuid = 'invalid-uuid';

            // Act & Assert
            try {
                await route.execute({ params: { uuid: invalidUuid } });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Must be a valid UUID format']);
            }
        });

        it('should validate UUID parameter is not empty', async () => {
            // Arrange
            const emptyUuid = '';

            // Act & Assert
            try {
                await route.execute({ params: { uuid: emptyUuid } });
                expect.fail('Should have thrown validation error');
            } catch (error) {
                assertValidationError(error, ['Must be a valid UUID format']);
            }
        });

        it('should handle application not found', async () => {
            // Arrange
            const error = new Error('Application not found');
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/start`, { error });

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow('Application not found');
        });

        it('should handle application already running', async () => {
            // Arrange
            const expectedResponse = { success: false, message: 'Application is already running' };
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/start`, expectedResponse);

            // Act
            const result = await route.execute({ params: { uuid: testUuid } });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.data.success).toBe(false);
        });

        it('should handle server errors', async () => {
            // Arrange
            const error = new Error('Internal server error');
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/start`, { error });

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow('Internal server error');
        });
    });
});
