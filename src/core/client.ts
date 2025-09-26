import { HttpClient } from './http-client.js';
import { CoolifyClientConfig } from './types.js';
import { RouteModule } from './route-interface.js';
import {
    ApplicationsRouteModule,
    DatabasesRouteModule,
    DeploymentsRouteModule
} from '../routes/index.js';

/**
 * Main Coolify SDK client with direct route access
 */
export class CoolifyClient {
    private readonly httpClient: HttpClient;
    private readonly routeModules: Map<string, RouteModule> = new Map();

    // Route modules
    private applicationsModule: ApplicationsRouteModule;
    private databasesModule: DatabasesRouteModule;
    private deploymentsModule: DeploymentsRouteModule;

    constructor(config: CoolifyClientConfig) {
        this.httpClient = new HttpClient(config);

        // Initialize route modules
        this.applicationsModule = new ApplicationsRouteModule();
        this.databasesModule = new DatabasesRouteModule();
        this.deploymentsModule = new DeploymentsRouteModule();

        // Register and initialize modules
        this.registerRouteModule(this.applicationsModule);
        this.registerRouteModule(this.databasesModule);
        this.registerRouteModule(this.deploymentsModule);
    }

    /**
     * Applications API - coolifyClient.applications.createPublic() or coolifyClient.applications(uuid).start()
     */
    get applications() {
        const routes = this.applicationsModule.getRoutes();

        // Create a function that can be called with UUID for specific application operations
        const applicationsFunction = (uuid: string) => routes.get(uuid);

        // Add static methods to the function
        Object.assign(applicationsFunction, {
            list: () => routes.list(),
            createPublic: (input: Parameters<typeof routes.createPublic>[0]) => routes.createPublic(input),
            createPrivateGithubApp: (input: Parameters<typeof routes.createPrivateGithubApp>[0]) => routes.createPrivateGithubApp(input),
            createPrivateDeployKey: (input: Parameters<typeof routes.createPrivateDeployKey>[0]) => routes.createPrivateDeployKey(input),
            createDockerfile: (input: Parameters<typeof routes.createDockerfile>[0]) => routes.createDockerfile(input),
            createDockerImage: (input: Parameters<typeof routes.createDockerImage>[0]) => routes.createDockerImage(input),
            createDockerCompose: (input: Parameters<typeof routes.createDockerCompose>[0]) => routes.createDockerCompose(input)
        });

        return applicationsFunction as typeof applicationsFunction & {
            list: typeof routes.list;
            createPublic: typeof routes.createPublic;
            createPrivateGithubApp: typeof routes.createPrivateGithubApp;
            createPrivateDeployKey: typeof routes.createPrivateDeployKey;
            createDockerfile: typeof routes.createDockerfile;
            createDockerImage: typeof routes.createDockerImage;
            createDockerCompose: typeof routes.createDockerCompose;
        };
    }

    /**
     * Databases API - coolifyClient.databases.createPostgreSQL() or coolifyClient.databases(uuid).start()
     */
    get databases() {
        const routes = this.databasesModule.getRoutes();

        // Create a function that can be called with UUID for specific database operations
        const databasesFunction = (uuid: string) => routes.get(uuid);

        // Add static methods to the function
        Object.assign(databasesFunction, {
            list: () => routes.list(),
            createPostgreSQL: (input: Parameters<typeof routes.createPostgreSQL>[0]) => routes.createPostgreSQL(input),
            createMySQL: (input: Parameters<typeof routes.createMySQL>[0]) => routes.createMySQL(input),
            createMariaDB: (input: Parameters<typeof routes.createMariaDB>[0]) => routes.createMariaDB(input),
            createMongoDB: (input: Parameters<typeof routes.createMongoDB>[0]) => routes.createMongoDB(input),
            createRedis: (input: Parameters<typeof routes.createRedis>[0]) => routes.createRedis(input),
            createKeyDB: (input: Parameters<typeof routes.createKeyDB>[0]) => routes.createKeyDB(input),
            createClickHouse: (input: Parameters<typeof routes.createClickHouse>[0]) => routes.createClickHouse(input),
            createDragonfly: (input: Parameters<typeof routes.createDragonfly>[0]) => routes.createDragonfly(input)
        });

        return databasesFunction as typeof databasesFunction & {
            list: typeof routes.list;
            createPostgreSQL: typeof routes.createPostgreSQL;
            createMySQL: typeof routes.createMySQL;
            createMariaDB: typeof routes.createMariaDB;
            createMongoDB: typeof routes.createMongoDB;
            createRedis: typeof routes.createRedis;
            createKeyDB: typeof routes.createKeyDB;
            createClickHouse: typeof routes.createClickHouse;
            createDragonfly: typeof routes.createDragonfly;
        };
    }

    /**
     * Deployments API - coolifyClient.deployments.list() or coolifyClient.deployments(uuid).details()
     */
    get deployments() {
        const routes = this.deploymentsModule.getRoutes();

        // Create a function that can be called with UUID for specific deployment operations
        const deploymentsFunction = (uuid: string) => routes.get(uuid);

        // Add static methods to the function
        Object.assign(deploymentsFunction, {
            list: () => routes.list(),
            deployByTag: (input: Parameters<typeof routes.deployByTag>[0]) => routes.deployByTag(input),
            applications: routes.applications
        });

        return deploymentsFunction as typeof deploymentsFunction & {
            list: typeof routes.list;
            deployByTag: typeof routes.deployByTag;
            applications: typeof routes.applications;
        };
    }

    /**
     * Register a route module with the client
     */
    registerRouteModule(module: RouteModule): void {
        if (this.routeModules.has(module.basePath)) {
            throw new Error(`Route module with base path '${module.basePath}' is already registered`);
        }

        module.initialize(this.httpClient);
        this.routeModules.set(module.basePath, module);
    }

    /**
     * Get a registered route module by its base path
     */
    getRouteModule<T extends RouteModule>(basePath: string): T | undefined {
        return this.routeModules.get(basePath) as T | undefined;
    }

    /**
     * Get all registered route modules
     */
    getRouteModules(): RouteModule[] {
        return Array.from(this.routeModules.values());
    }

    /**
     * Get the underlying HTTP client (for advanced usage)
     */
    getHttpClient(): HttpClient {
        return this.httpClient;
    }
}
