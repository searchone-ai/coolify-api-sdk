import { HttpClient } from '../../core/http-client.js';
import { RouteModule } from '../../core/route-interface.js';

// Import all application route classes
import { ListApplicationsRoute } from './GET.js';
import { CreatePublicApplicationRoute } from './public/POST.js';
import { CreatePrivateGithubAppApplicationRoute } from './private-github-app/POST.js';
import { CreatePrivateDeployKeyApplicationRoute } from './private-deploy-key/POST.js';
import { CreateDockerfileApplicationRoute } from './dockerfile/POST.js';
import { CreateDockerImageApplicationRoute } from './dockerimage/POST.js';
import { CreateDockerComposeApplicationRoute } from './dockercompose/POST.js';
import { GetApplicationRoute } from './{uuid}/GET.js';
import { GetApplicationLogsRoute } from './{uuid}/logs/GET.js';
import { GetApplicationEnvironmentVariablesRoute } from './{uuid}/envs/GET.js';
import { CreateBulkApplicationEnvironmentVariablesRoute } from './{uuid}/envs/bulk/POST.js';
import { GetApplicationEnvironmentVariableRoute } from './{uuid}/envs/{env_uuid}/GET.js';
import { UpdateApplicationEnvironmentVariableRoute } from './{uuid}/envs/{env_uuid}/PATCH.js';
import { DeleteApplicationEnvironmentVariableRoute } from './{uuid}/envs/{env_uuid}/DELETE.js';
import { StartApplicationRoute } from './{uuid}/start/POST.js';
import { StopApplicationRoute } from './{uuid}/stop/POST.js';
import { RestartApplicationRoute } from './{uuid}/restart/POST.js';

/**
 * Applications route handler with all application-related operations
 */
export class ApplicationsRoute {
    private listApplicationsRoute?: ListApplicationsRoute;
    private createPublicApplicationRoute?: CreatePublicApplicationRoute;
    private createPrivateGithubAppApplicationRoute?: CreatePrivateGithubAppApplicationRoute;
    private createPrivateDeployKeyApplicationRoute?: CreatePrivateDeployKeyApplicationRoute;
    private createDockerfileApplicationRoute?: CreateDockerfileApplicationRoute;
    private createDockerImageApplicationRoute?: CreateDockerImageApplicationRoute;
    private createDockerComposeApplicationRoute?: CreateDockerComposeApplicationRoute;
    private getApplicationRoute?: GetApplicationRoute;
    private getApplicationLogsRoute?: GetApplicationLogsRoute;
    private getApplicationEnvironmentVariablesRoute?: GetApplicationEnvironmentVariablesRoute;
    private createBulkApplicationEnvironmentVariablesRoute?: CreateBulkApplicationEnvironmentVariablesRoute;
    private getApplicationEnvironmentVariableRoute?: GetApplicationEnvironmentVariableRoute;
    private updateApplicationEnvironmentVariableRoute?: UpdateApplicationEnvironmentVariableRoute;
    private deleteApplicationEnvironmentVariableRoute?: DeleteApplicationEnvironmentVariableRoute;
    private startApplicationRoute?: StartApplicationRoute;
    private stopApplicationRoute?: StopApplicationRoute;
    private restartApplicationRoute?: RestartApplicationRoute;

    constructor(private readonly httpClient: HttpClient) {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.listApplicationsRoute = new ListApplicationsRoute(this.httpClient);
        this.createPublicApplicationRoute = new CreatePublicApplicationRoute(this.httpClient);
        this.createPrivateGithubAppApplicationRoute = new CreatePrivateGithubAppApplicationRoute(this.httpClient);
        this.createPrivateDeployKeyApplicationRoute = new CreatePrivateDeployKeyApplicationRoute(this.httpClient);
        this.createDockerfileApplicationRoute = new CreateDockerfileApplicationRoute(this.httpClient);
        this.createDockerImageApplicationRoute = new CreateDockerImageApplicationRoute(this.httpClient);
        this.createDockerComposeApplicationRoute = new CreateDockerComposeApplicationRoute(this.httpClient);
        this.getApplicationRoute = new GetApplicationRoute(this.httpClient);
        this.getApplicationLogsRoute = new GetApplicationLogsRoute(this.httpClient);
        this.getApplicationEnvironmentVariablesRoute = new GetApplicationEnvironmentVariablesRoute(this.httpClient);
        this.createBulkApplicationEnvironmentVariablesRoute = new CreateBulkApplicationEnvironmentVariablesRoute(this.httpClient);
        this.getApplicationEnvironmentVariableRoute = new GetApplicationEnvironmentVariableRoute(this.httpClient);
        this.updateApplicationEnvironmentVariableRoute = new UpdateApplicationEnvironmentVariableRoute(this.httpClient);
        this.deleteApplicationEnvironmentVariableRoute = new DeleteApplicationEnvironmentVariableRoute(this.httpClient);
        this.startApplicationRoute = new StartApplicationRoute(this.httpClient);
        this.stopApplicationRoute = new StopApplicationRoute(this.httpClient);
        this.restartApplicationRoute = new RestartApplicationRoute(this.httpClient);
    }

    /**
     * List all applications
     */
    async list() {
        return this.listApplicationsRoute!.execute();
    }

    /**
     * Create application from public repository
     */
    async createPublic(input: Parameters<CreatePublicApplicationRoute['execute']>[0]) {
        return this.createPublicApplicationRoute!.execute(input);
    }

    /**
     * Create application from private GitHub App repository
     */
    async createPrivateGithubApp(input: Parameters<CreatePrivateGithubAppApplicationRoute['execute']>[0]) {
        return this.createPrivateGithubAppApplicationRoute!.execute(input);
    }

    /**
     * Create application from private repository with deploy key
     */
    async createPrivateDeployKey(input: Parameters<CreatePrivateDeployKeyApplicationRoute['execute']>[0]) {
        return this.createPrivateDeployKeyApplicationRoute!.execute(input);
    }

    /**
     * Create application from Dockerfile
     */
    async createDockerfile(input: Parameters<CreateDockerfileApplicationRoute['execute']>[0]) {
        return this.createDockerfileApplicationRoute!.execute(input);
    }

    /**
     * Create application from Docker image
     */
    async createDockerImage(input: Parameters<CreateDockerImageApplicationRoute['execute']>[0]) {
        return this.createDockerImageApplicationRoute!.execute(input);
    }

    /**
     * Create application from Docker Compose
     */
    async createDockerCompose(input: Parameters<CreateDockerComposeApplicationRoute['execute']>[0]) {
        return this.createDockerComposeApplicationRoute!.execute(input);
    }

    /**
     * Get application by UUID - returns a function that takes UUID
     */
    get(uuid: string) {
        return {
            /**
             * Get application details
             */
            details: () => this.getApplicationRoute!.execute({ params: { uuid } }),

            /**
             * Get application logs
             */
            logs: () => this.getApplicationLogsRoute!.execute({ params: { uuid } }),

            /**
             * Environment variables operations
             */
            envs: {
                /**
                 * List all environment variables
                 */
                list: () => this.getApplicationEnvironmentVariablesRoute!.execute({ params: { uuid } }),

                /**
                 * Create multiple environment variables
                 */
                createBulk: (input: { body: Parameters<CreateBulkApplicationEnvironmentVariablesRoute['execute']>[0]['body'] }) =>
                    this.createBulkApplicationEnvironmentVariablesRoute!.execute({ params: { uuid }, body: input.body }),

                /**
                 * Get specific environment variable
                 */
                get: (envUuid: string) => this.getApplicationEnvironmentVariableRoute!.execute({ params: { uuid, env_uuid: envUuid } }),

                /**
                 * Update specific environment variable
                 */
                update: (envUuid: string, input: { body: Parameters<UpdateApplicationEnvironmentVariableRoute['execute']>[0]['body'] }) =>
                    this.updateApplicationEnvironmentVariableRoute!.execute({ params: { uuid, env_uuid: envUuid }, body: input.body }),

                /**
                 * Delete specific environment variable
                 */
                delete: (envUuid: string) => this.deleteApplicationEnvironmentVariableRoute!.execute({ params: { uuid, env_uuid: envUuid } })
            },

            /**
             * Start application
             */
            start: () => this.startApplicationRoute!.execute({ params: { uuid } }),

            /**
             * Stop application
             */
            stop: () => this.stopApplicationRoute!.execute({ params: { uuid } }),

            /**
             * Restart application
             */
            restart: () => this.restartApplicationRoute!.execute({ params: { uuid } })
        };
    }
}

/**
 * Applications route module
 */
export class ApplicationsRouteModule implements RouteModule {
    readonly basePath = '/applications';
    private routes?: ApplicationsRoute;

    initialize(httpClient: HttpClient): void {
        this.routes = new ApplicationsRoute(httpClient);
    }

    getRoutes(): ApplicationsRoute {
        if (!this.routes) {
            throw new Error('Applications route module not initialized');
        }
        return this.routes;
    }
}
