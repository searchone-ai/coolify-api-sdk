/**
 * Core module exports
 */

export { CoolifyClient } from './client.js';
export { HttpClient } from './http-client.js';
export {
    BaseRoute,
    type RouteModule,
    type RouteConfig,
    type RouteInput,
    type ExtractRouteInput,
    type ExtractRouteResponse,
} from './route-interface.js';
export {
    CoolifyApiError,
    type CoolifyClientConfig,
    type HttpMethod,
    type RequestConfig,
    type ApiResponse,
    type ApiError,
    type BaseResponse,
    BaseResponseSchema,
} from './types.js';
