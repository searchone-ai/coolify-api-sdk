import { describe, it, expect, beforeEach } from 'vitest';
import { GetApplicationRoute } from '../../../../src/routes/applications/{uuid}/GET.js';
import { MockHttpClient, loadMockData, createTestUuid, assertValidationError } from '../../../utils/test-helpers.js';

describe('GetApplicationRoute', () => {
    let mockHttpClient: MockHttpClient;
    let route: GetApplicationRoute;
    let mockData: any;
    let testUuid: string;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        route = new GetApplicationRoute(mockHttpClient);
        mockData = await loadMockData('applications');
        testUuid = createTestUuid();
    });

    describe('execute', () => {
        it('should successfully get application by UUID', async () => {
            // Arrange
            const expectedApplication = mockData.validApplication;
            mockHttpClient.setMockResponse('GET', `/applications/${testUuid}`, { data: expectedApplication, status: 200 });

            // Act
            const result = await route.execute({ params: { uuid: testUuid } });

            // Assert
            expect(result.data).toEqual(expectedApplication);
            expect(result.status).toBe(200);

            const lastRequest = mockHttpClient.getLastRequest();
            expect(lastRequest.method).toBe('GET');
            expect(lastRequest.path).toBe(`/applications/${testUuid}`);
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
            mockHttpClient.setMockResponse('GET', `/applications/${testUuid}`, { error });

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow('Application not found');
        });

        it('should validate response schema', async () => {
            // Arrange
            const invalidResponse = {
                id: 'not-a-number',
                uuid: 'invalid-uuid',
                // Missing required fields
            };
            mockHttpClient.setMockResponse('GET', `/applications/${testUuid}`, invalidResponse);

            // Act & Assert
            await expect(route.execute({ params: { uuid: testUuid } })).rejects.toThrow();
        });
    });
});
