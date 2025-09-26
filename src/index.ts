/**
 * Coolify API SDK
 * 
 * A TypeScript SDK for the Coolify API with full type safety and validation using Zod.
 */

// Core exports
export { CoolifyClient } from './core/client.js';
export { HttpClient } from './core/http-client.js';
export {
    BaseRoute,
    type RouteModule,
    type RouteConfig,
    type RouteInput,
    type ExtractRouteInput,
    type ExtractRouteResponse,
} from './core/route-interface.js';
export {
    CoolifyApiError,
    type CoolifyClientConfig,
    type HttpMethod,
    type RequestConfig,
    type ApiResponse,
    type ApiError,
    type BaseResponse,
    BaseResponseSchema,
} from './core/types.js';

// Route modules (will be populated as routes are implemented)
export * from './routes/index.js';

// Import types for function signature
import type { CoolifyClientConfig } from './core/types.js';
import { CoolifyClient } from './core/client.js';

/**
 * Create a new Coolify SDK client instance
 */
export function createCoolifyClient(config: CoolifyClientConfig): CoolifyClient {
    return new CoolifyClient(config);
}

/**
 * Default export for convenience
 */
export default {
    CoolifyClient,
    createCoolifyClient,
};
