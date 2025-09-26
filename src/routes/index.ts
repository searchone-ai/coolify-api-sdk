/**
 * Route modules export
 * 
 * This file exports all implemented route modules for the Coolify API SDK.
 * Each route module provides access to specific API endpoints with full type safety.
 */

// Applications routes
export { ApplicationsRouteModule } from './applications/index.js';

// Databases routes
export { DatabasesRouteModule } from './databases/index.js';

// Deployments routes
export { DeploymentsRouteModule } from './deployments/index.js';

// Re-export core types for convenience
export type { RouteModule } from '../core/route-interface.js';
