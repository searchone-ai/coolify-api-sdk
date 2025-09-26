import { describe, it, expect, beforeEach } from 'vitest';
import { ApplicationsRoute, ApplicationsRouteModule } from '../../../src/routes/applications/index.js';
import { MockHttpClient, loadMockData, createTestUuid } from '../../utils/test-helpers.js';

describe('ApplicationsRoute', () => {
    let mockHttpClient: MockHttpClient;
    let applicationsRoute: ApplicationsRoute;
    let mockData: any;
    let testUuid: string;

    beforeEach(async () => {
        mockHttpClient = new MockHttpClient();
        applicationsRoute = new ApplicationsRoute(mockHttpClient);
        mockData = await loadMockData('applications');
        testUuid = createTestUuid();
    });

    describe('list', () => {
        it('should list all applications', async () => {
            // Arrange
            const expectedApplications = [mockData.validApplication];
            mockHttpClient.setMockResponse('GET', '/applications', expectedApplications);

            // Act
            const result = await applicationsRoute.list();

            // Assert
            expect(result.data).toEqual(expectedApplications);
        });
    });

    describe('createPublic', () => {
        it('should create a public application', async () => {
            // Arrange
            const requestBody = mockData.validCreatePublicRequest;
            const expectedResponse = mockData.validApplication;
            mockHttpClient.setMockResponse('POST', '/applications/public', expectedResponse);

            // Act
            const result = await applicationsRoute.createPublic({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
        });
    });

    describe('get(uuid)', () => {
        it('should return application-specific operations', () => {
            // Act
            const appOperations = applicationsRoute.get(testUuid);

            // Assert
            expect(appOperations).toHaveProperty('details');
            expect(appOperations).toHaveProperty('logs');
            expect(appOperations).toHaveProperty('start');
            expect(appOperations).toHaveProperty('stop');
            expect(appOperations).toHaveProperty('restart');
            expect(appOperations).toHaveProperty('envs');
            expect(typeof appOperations.details).toBe('function');
            expect(typeof appOperations.start).toBe('function');
            expect(typeof appOperations.envs.list).toBe('function');
        });

        it('should get application details', async () => {
            // Arrange
            const expectedApplication = mockData.validApplication;
            mockHttpClient.setMockResponse('GET', `/applications/${testUuid}`, expectedApplication);

            // Act
            const result = await applicationsRoute.get(testUuid).details();

            // Assert
            expect(result.data).toEqual(expectedApplication);
        });

        it('should start application', async () => {
            // Arrange
            const expectedResponse = { success: true, message: 'Application started' };
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/start`, expectedResponse);

            // Act
            const result = await applicationsRoute.get(testUuid).start();

            // Assert
            expect(result.data).toEqual(expectedResponse);
        });

        it('should list environment variables', async () => {
            // Arrange
            const expectedEnvVars = [mockData.validEnvironmentVariable];
            mockHttpClient.setMockResponse('GET', `/applications/${testUuid}/envs`, expectedEnvVars);

            // Act
            const result = await applicationsRoute.get(testUuid).envs.list();

            // Assert
            expect(result.data).toEqual(expectedEnvVars);
        });

        it('should create bulk environment variables', async () => {
            // Arrange
            const requestBody = mockData.validBulkEnvironmentVariables;
            const expectedResponse = [mockData.validEnvironmentVariable];
            mockHttpClient.setMockResponse('POST', `/applications/${testUuid}/envs/bulk`, expectedResponse);

            // Act
            const result = await applicationsRoute.get(testUuid).envs.createBulk({ body: requestBody });

            // Assert
            expect(result.data).toEqual(expectedResponse);
        });
    });
});

describe('ApplicationsRouteModule', () => {
    let mockHttpClient: MockHttpClient;
    let routeModule: ApplicationsRouteModule;

    beforeEach(() => {
        mockHttpClient = new MockHttpClient();
        routeModule = new ApplicationsRouteModule();
    });

    describe('initialization', () => {
        it('should have correct base path', () => {
            expect(routeModule.basePath).toBe('/applications');
        });

        it('should throw error when getting routes before initialization', () => {
            expect(() => routeModule.getRoutes()).toThrow('Applications route module not initialized');
        });

        it('should initialize successfully', () => {
            // Act
            routeModule.initialize(mockHttpClient);

            // Assert
            expect(() => routeModule.getRoutes()).not.toThrow();
            expect(routeModule.getRoutes()).toBeInstanceOf(ApplicationsRoute);
        });
    });
});
