# Routes Directory

This directory contains all API route implementations organized by their URL path structure.

## Structure

Each route should be organized in directories that mirror the API path structure. For example:

```
src/routes/
├── users/
│   ├── index.ts          # /users routes
│   ├── {id}/
│   │   ├── index.ts      # /users/{id} routes
│   │   └── projects/
│   │       └── index.ts  # /users/{id}/projects routes
├── projects/
│   ├── index.ts          # /projects routes
│   └── {id}/
│       └── index.ts      # /projects/{id} routes
└── index.ts              # Route module exports
```

## Implementation Guidelines

1. Each route file should export a class that extends `BaseRoute`
2. Each route module should implement the `RouteModule` interface
3. Use Zod schemas for all input/output validation
4. Keep route files focused on a single responsibility
5. Group related routes in the same directory/file when appropriate

## Example Route Implementation

```typescript
import { z } from 'zod';
import { BaseRoute, RouteModule, RouteConfig } from '../../core/route-interface.js';
import { HttpClient } from '../../core/http-client.js';

// Schemas
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const GetUserParamsSchema = z.object({
  id: z.string(),
});

// Route configurations
const getUserConfig: RouteConfig = {
  method: 'GET',
  path: '/users/{id}',
  paramsSchema: GetUserParamsSchema,
  responseSchema: UserSchema,
};

// Route implementation
export class UsersRoute extends BaseRoute {
  async getUser(input: { params: { id: string } }) {
    return this.executeRoute(getUserConfig, input);
  }
}

// Route module
export class UsersRouteModule implements RouteModule {
  readonly basePath = '/users';
  private routes?: UsersRoute;

  initialize(httpClient: HttpClient): void {
    this.routes = new UsersRoute(httpClient);
  }

  getRoutes(): UsersRoute {
    if (!this.routes) {
      throw new Error('Route module not initialized');
    }
    return this.routes;
  }
}
```
