import { HttpClient } from '../../core/http-client.js';
import { RouteModule } from '../../core/route-interface.js';

// Import all database route classes
import { ListDatabasesRoute } from './GET.js';
import { GetDatabaseRoute } from './{uuid}/GET.js';
import { CreatePostgreSQLDatabaseRoute } from './postgresql/POST.js';
import { CreateMySQLDatabaseRoute } from './mysql/POST.js';
import { CreateMariaDBDatabaseRoute } from './mariadb/POST.js';
import { CreateMongoDBDatabaseRoute } from './mongodb/POST.js';
import { CreateRedisDatabaseRoute } from './redis/POST.js';
import { CreateKeyDBDatabaseRoute } from './keydb/POST.js';
import { CreateClickHouseDatabaseRoute } from './clickhouse/POST.js';
import { CreateDragonflyDatabaseRoute } from './dragonfly/POST.js';
import { StartDatabaseRoute } from './{uuid}/start/POST.js';
import { StopDatabaseRoute } from './{uuid}/stop/POST.js';
import { RestartDatabaseRoute } from './{uuid}/restart/POST.js';

/**
 * Databases route handler with all database-related operations
 */
export class DatabasesRoute {
    private listDatabasesRoute?: ListDatabasesRoute;
    private getDatabaseRoute?: GetDatabaseRoute;
    private createPostgreSQLDatabaseRoute?: CreatePostgreSQLDatabaseRoute;
    private createMySQLDatabaseRoute?: CreateMySQLDatabaseRoute;
    private createMariaDBDatabaseRoute?: CreateMariaDBDatabaseRoute;
    private createMongoDBDatabaseRoute?: CreateMongoDBDatabaseRoute;
    private createRedisDatabaseRoute?: CreateRedisDatabaseRoute;
    private createKeyDBDatabaseRoute?: CreateKeyDBDatabaseRoute;
    private createClickHouseDatabaseRoute?: CreateClickHouseDatabaseRoute;
    private createDragonflyDatabaseRoute?: CreateDragonflyDatabaseRoute;
    private startDatabaseRoute?: StartDatabaseRoute;
    private stopDatabaseRoute?: StopDatabaseRoute;
    private restartDatabaseRoute?: RestartDatabaseRoute;

    constructor(private readonly httpClient: HttpClient) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.listDatabasesRoute = new ListDatabasesRoute(this.httpClient);
        this.getDatabaseRoute = new GetDatabaseRoute(this.httpClient);
        this.createPostgreSQLDatabaseRoute = new CreatePostgreSQLDatabaseRoute(this.httpClient);
        this.createMySQLDatabaseRoute = new CreateMySQLDatabaseRoute(this.httpClient);
        this.createMariaDBDatabaseRoute = new CreateMariaDBDatabaseRoute(this.httpClient);
        this.createMongoDBDatabaseRoute = new CreateMongoDBDatabaseRoute(this.httpClient);
        this.createRedisDatabaseRoute = new CreateRedisDatabaseRoute(this.httpClient);
        this.createKeyDBDatabaseRoute = new CreateKeyDBDatabaseRoute(this.httpClient);
        this.createClickHouseDatabaseRoute = new CreateClickHouseDatabaseRoute(this.httpClient);
        this.createDragonflyDatabaseRoute = new CreateDragonflyDatabaseRoute(this.httpClient);
        this.startDatabaseRoute = new StartDatabaseRoute(this.httpClient);
        this.stopDatabaseRoute = new StopDatabaseRoute(this.httpClient);
        this.restartDatabaseRoute = new RestartDatabaseRoute(this.httpClient);
    }

    /**
     * List all databases
     */
    async list() {
        return this.listDatabasesRoute!.execute();
    }

    /**
     * Create PostgreSQL database
     */
    async createPostgreSQL(input: Parameters<CreatePostgreSQLDatabaseRoute['execute']>[0]) {
        return this.createPostgreSQLDatabaseRoute!.execute(input);
    }

    /**
     * Create MySQL database
     */
    async createMySQL(input: Parameters<CreateMySQLDatabaseRoute['execute']>[0]) {
        return this.createMySQLDatabaseRoute!.execute(input);
    }

    /**
     * Create MariaDB database
     */
    async createMariaDB(input: Parameters<CreateMariaDBDatabaseRoute['execute']>[0]) {
        return this.createMariaDBDatabaseRoute!.execute(input);
    }

    /**
     * Create MongoDB database
     */
    async createMongoDB(input: Parameters<CreateMongoDBDatabaseRoute['execute']>[0]) {
        return this.createMongoDBDatabaseRoute!.execute(input);
    }

    /**
     * Create Redis database
     */
    async createRedis(input: Parameters<CreateRedisDatabaseRoute['execute']>[0]) {
        return this.createRedisDatabaseRoute!.execute(input);
    }

    /**
     * Create KeyDB database
     */
    async createKeyDB(input: Parameters<CreateKeyDBDatabaseRoute['execute']>[0]) {
        return this.createKeyDBDatabaseRoute!.execute(input);
    }

    /**
     * Create ClickHouse database
     */
    async createClickHouse(input: Parameters<CreateClickHouseDatabaseRoute['execute']>[0]) {
        return this.createClickHouseDatabaseRoute!.execute(input);
    }

    /**
     * Create Dragonfly database
     */
    async createDragonfly(input: Parameters<CreateDragonflyDatabaseRoute['execute']>[0]) {
        return this.createDragonflyDatabaseRoute!.execute(input);
    }

    /**
     * Get database by UUID - returns a function that takes UUID
     */
    get(uuid: string) {
        return {
            /**
             * Get database details
             */
            details: () => this.getDatabaseRoute!.execute({ params: { uuid } }),

            /**
             * Start database
             */
            start: () => this.startDatabaseRoute!.execute({ params: { uuid } }),

            /**
             * Stop database
             */
            stop: () => this.stopDatabaseRoute!.execute({ params: { uuid } }),

            /**
             * Restart database
             */
            restart: () => this.restartDatabaseRoute!.execute({ params: { uuid } })
        };
    }
}

/**
 * Databases route module
 */
export class DatabasesRouteModule implements RouteModule {
    readonly basePath = '/databases';
    private routes?: DatabasesRoute;

    initialize(httpClient: HttpClient): void {
        this.routes = new DatabasesRoute(httpClient);
    }

    getRoutes(): DatabasesRoute {
        if (!this.routes) {
            throw new Error('Databases route module not initialized');
        }
        return this.routes;
    }
}
