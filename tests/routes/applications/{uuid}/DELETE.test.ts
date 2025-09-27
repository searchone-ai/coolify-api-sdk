import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteApplicationRoute } from '../../../../src/routes/applications/{uuid}/DELETE.js';
import { MockHttpClient, createTestUuid, assertValidationError } from '../../../utils/test-helpers.js';

describe('DeleteApplicationRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: DeleteApplicationRoute;
    let testUuid: string;

    beforeEach(() => {
        mockHttpClient = new MockHttpClient();
        route = new DeleteApplicationRoute(mockHttpClient);
        testUuid = createTestUuid();
    });

    describe('execute', () => {
        it('should successfully delete application by UUID', async () => {
            // Arrange
            const expectedResponse = { success: true, message: 'Application deleted successfully' };
            mockHttpClient.setMockResponse('DELETE', `/applications/${testUuid}`, expectedResponse);

            // Act
            const result = await route.execute({ params: { uuid: testUuid } });

            // Assert
            expect(result.data).toEqual(expectedResponse);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('DELETE');
            expect(lastRequest.path).toBe(`/applications/${testUuid}`);
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
                assertValidationError(error, ['Must be a valid 24-character UUID format']);
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
                assertValidationError(error, ['Must be a valid 24-character UUID format']);
            }
        });

        it('should handle application not found', async () => {
            // Arrange
            const error = new Error('Application not found');
            mockHttpClient.setMockResponse('DELETE', `/applications/${testUuid}`, { error });

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow('Application not found');
        });

        it('should validate response schema', async () => {
            // Arrange
            const invalidResponse = {
                // Missing success field
                message: 'Application deleted'
            };
            mockHttpClient.setMockResponse('DELETE', `/applications/${testUuid}`, invalidResponse);

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow();
        });

        it('should handle server errors gracefully', async () => {
            // Arrange
            const serverError = new Error('Internal server error');
            mockHttpClient.setMockResponse('DELETE', `/applications/${testUuid}`, { error: serverError });

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow('Internal server error');
        });

        it('should handle deletion conflicts', async () => {
            // Arrange
            const conflictResponse = { 
                success: false, 
                message: 'Cannot delete application with active deployments' 
            };
            mockHttpClient.setMockResponse('DELETE', `/applications/${testUuid}`, conflictResponse);

            // Act
            const result = await route.execute({ params: { uuid: testUuid } });

            // Assert
            expect(result.data).toEqual(conflictResponse);
            expect(result.data.success).toBe(false);
            expect(result.data.message).toContain('Cannot delete application');
        });
    });
});
