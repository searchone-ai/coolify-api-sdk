import { HttpClient } from '../../core/http-client.js';
import { RouteModule } from '../../core/route-interface.js';

// Import all deployment route classes
import { ListDeploymentsRoute } from './GET.js';
import { GetDeploymentRoute } from './{uuid}/GET.js';
import { DeployByTagRoute } from '../deploy/POST.js';
import { DeployApplicationRoute } from './applications/{uuid}/POST.js';

/**
 * Deployments route handler with all deployment-related operations
 */
export class DeploymentsRoute {
    private listDeploymentsRoute?: ListDeploymentsRoute;
    private getDeploymentRoute?: GetDeploymentRoute;
    private deployByTagRoute?: DeployByTagRoute;
    private deployApplicationRoute?: DeployApplicationRoute;

    constructor(private readonly httpClient: HttpClient) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.listDeploymentsRoute = new ListDeploymentsRoute(this.httpClient);
        this.getDeploymentRoute = new GetDeploymentRoute(this.httpClient);
        this.deployByTagRoute = new DeployByTagRoute(this.httpClient);
        this.deployApplicationRoute = new DeployApplicationRoute(this.httpClient);
    }

    /**
     * List all deployments
     */
    async list() {
        return this.listDeploymentsRoute!.execute();
    }

    /**
     * Deploy by tag
     */
    async deployByTag(input: Parameters<DeployByTagRoute['execute']>[0]) {
        return this.deployByTagRoute!.execute(input);
    }

    /**
     * Get deployment by UUID - returns a function that takes UUID
     */
    get(uuid: string) {
        return {
            /**
             * Get deployment details
             */
            details: () => this.getDeploymentRoute!.execute({ params: { uuid } })
        };
    }

    /**
     * Application deployment operations
     */
    get applications() {
        return {
            /**
             * Deploy application by UUID
             */
            deploy: (uuid: string, input: { body: Parameters<DeployApplicationRoute['execute']>[0]['body'] }) =>
                this.deployApplicationRoute!.execute({ params: { uuid }, body: input.body })
        };
    }
}

/**
 * Deployments route module
 */
export class DeploymentsRouteModule implements RouteModule {
    readonly basePath = '/deployments';
    private routes?: DeploymentsRoute;

    initialize(httpClient: HttpClient): void {
        this.routes = new DeploymentsRoute(httpClient);
    }

    getRoutes(): DeploymentsRoute {
        if (!this.routes) {
            throw new Error('Deployments route module not initialized');
        }
        return this.routes;
    }
}
