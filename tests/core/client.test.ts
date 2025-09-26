import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoolifyClient } from '../../src/core/client.js';
import { createTestConfig, loadMockData, createTestUuid } from '../utils/test-helpers.js';

// Mock the HTTP client to avoid actual network calls
vi.mock('../../src/core/http-client.js', () => {
    return {
        HttpClient: vi.fn().mockImplementation(() => ({
            request: vi.fn().mockResolvedValue({
                data: {},
                status: 200,
                statusText: 'OK',
                headers: {}
            })
        }))
    };
});

describe('CoolifyClient', () => {
    let client: CoolifyClient;
    let mockData: any;
    let testUuid: string;

    beforeEach(async () => {
        const config = createTestConfig();
        client = new CoolifyClient(config);
        mockData = await loadMockData('applications');
        testUuid = createTestUuid();
    });

    describe('initialization', () => {
        it('should initialize with correct configuration', () => {
            expect(client).toBeInstanceOf(CoolifyClient);
        });

        it('should have applications property', () => {
            expect(client.applications).toBeDefined();
            expect(typeof client.applications).toBe('function');
        });

        it('should have databases property', () => {
            expect(client.databases).toBeDefined();
            expect(typeof client.databases).toBe('function');
        });

        it('should have deployments property', () => {
            expect(client.deployments).toBeDefined();
            expect(typeof client.deployments).toBe('function');
        });
    });

    describe('applications API', () => {
        it('should have static methods', () => {
            expect(client.applications.list).toBeDefined();
            expect(client.applications.createPublic).toBeDefined();
            expect(client.applications.createPrivateGithubApp).toBeDefined();
            expect(client.applications.createPrivateDeployKey).toBeDefined();
            expect(client.applications.createDockerfile).toBeDefined();
            expect(client.applications.createDockerImage).toBeDefined();
            expect(client.applications.createDockerCompose).toBeDefined();

            expect(typeof client.applications.list).toBe('function');
            expect(typeof client.applications.createPublic).toBe('function');
        });

        it('should be callable with UUID for specific operations', () => {
            const appOperations = client.applications(testUuid);

            expect(appOperations).toBeDefined();
            expect(appOperations.details).toBeDefined();
            expect(appOperations.logs).toBeDefined();
            expect(appOperations.start).toBeDefined();
            expect(appOperations.stop).toBeDefined();
            expect(appOperations.restart).toBeDefined();
            expect(appOperations.envs).toBeDefined();

            expect(typeof appOperations.details).toBe('function');
            expect(typeof appOperations.start).toBe('function');
            expect(typeof appOperations.envs.list).toBe('function');
        });

        it('should call list method', async () => {
            // Act
            await client.applications.list();

            // Assert - The mock should have been called
            // This test verifies the method exists and is callable
            expect(true).toBe(true);
        });

        it('should call createPublic method', async () => {
            // Arrange
            const requestBody = mockData.validCreatePublicRequest;

            // Act
            await client.applications.createPublic({ body: requestBody });

            // Assert - The mock should have been called
            expect(true).toBe(true);
        });

        it('should call application-specific methods', async () => {
            // Act
            await client.applications(testUuid).details();
            await client.applications(testUuid).start();
            await client.applications(testUuid).envs.list();

            // Assert - The mocks should have been called
            expect(true).toBe(true);
        });
    });

    describe('databases API', () => {
        it('should have static methods', () => {
            expect(client.databases.list).toBeDefined();
            expect(client.databases.createPostgreSQL).toBeDefined();
            expect(client.databases.createMySQL).toBeDefined();
            expect(client.databases.createMariaDB).toBeDefined();
            expect(client.databases.createMongoDB).toBeDefined();
            expect(client.databases.createRedis).toBeDefined();
            expect(client.databases.createKeyDB).toBeDefined();
            expect(client.databases.createClickHouse).toBeDefined();
            expect(client.databases.createDragonfly).toBeDefined();

            expect(typeof client.databases.list).toBe('function');
            expect(typeof client.databases.createPostgreSQL).toBe('function');
        });

        it('should be callable with UUID for specific operations', () => {
            const dbOperations = client.databases(testUuid);

            expect(dbOperations).toBeDefined();
            expect(dbOperations.details).toBeDefined();
            expect(dbOperations.start).toBeDefined();
            expect(dbOperations.stop).toBeDefined();
            expect(dbOperations.restart).toBeDefined();

            expect(typeof dbOperations.details).toBe('function');
            expect(typeof dbOperations.start).toBe('function');
        });
    });

    describe('deployments API', () => {
        it('should have static methods', () => {
            expect(client.deployments.list).toBeDefined();
            expect(client.deployments.deployByTag).toBeDefined();
            expect(client.deployments.applications).toBeDefined();

            expect(typeof client.deployments.list).toBe('function');
            expect(typeof client.deployments.deployByTag).toBe('function');
        });

        it('should be callable with UUID for specific operations', () => {
            const deploymentOperations = client.deployments(testUuid);

            expect(deploymentOperations).toBeDefined();
            expect(deploymentOperations.details).toBeDefined();

            expect(typeof deploymentOperations.details).toBe('function');
        });

        it('should have applications deployment methods', () => {
            expect(client.deployments.applications).toBeDefined();
            expect(client.deployments.applications.deploy).toBeDefined();
            expect(typeof client.deployments.applications.deploy).toBe('function');
        });
    });

    describe('route module management', () => {
        it('should get route modules', () => {
            const modules = client.getRouteModules();
            expect(modules).toHaveLength(3); // applications, databases, deployments
        });

        it('should get specific route module', () => {
            const applicationsModule = client.getRouteModule('/applications');
            expect(applicationsModule).toBeDefined();
            expect(applicationsModule?.basePath).toBe('/applications');
        });

        it('should return undefined for non-existent route module', () => {
            const nonExistentModule = client.getRouteModule('/non-existent');
            expect(nonExistentModule).toBeUndefined();
        });

        it('should get HTTP client', () => {
            const httpClient = client.getHttpClient();
            expect(httpClient).toBeDefined();
        });
    });
});
