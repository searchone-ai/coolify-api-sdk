import { HttpClient } from '../../src/core/http-client.js';
import { CoolifyClientConfig } from '../../src/core/types.js';

/**
 * Mock HTTP client for testing
 */
export class MockHttpClient extends HttpClient {
    private mockResponses: Map<string, any> = new Map();
    private lastRequest: any = null;

    constructor() {
        super({
            baseUrl: 'https://test.coolify.io/api/v1',
            apiToken: 'test-token'
        });
    }

    /**
     * Set a mock response for a specific method and path
     */
    setMockResponse(method: string, path: string, response: any): void {
        const key = `${method.toUpperCase()}:${path}`;
        this.mockResponses.set(key, response);
    }

    /**
     * Get the last request made
     */
    getLastRequest(): any {
        return this.lastRequest;
    }

    /**
     * Clear all mock responses
     */
    clearMockResponses(): void {
        this.mockResponses.clear();
        this.lastRequest = null;
    }

    /**
     * Override the request method to return mock responses
     */
    async request<T>(requestConfig: any, responseSchema?: any): Promise<any> {
        this.lastRequest = requestConfig;

        const key = `${requestConfig.method.toUpperCase()}:${requestConfig.path}`;
        const mockResponse = this.mockResponses.get(key);

        if (mockResponse) {
            if (mockResponse.error) {
                throw mockResponse.error;
            }

            // Handle different mock response structures
            let responseData;
            let status = 200;
            let statusText = 'OK';
            let headers = {};

            if (mockResponse.data !== undefined) {
                // Structured mock response with explicit data/status
                responseData = mockResponse.data;
                status = mockResponse.status || 200;
                statusText = mockResponse.statusText || 'OK';
                headers = mockResponse.headers || {};
            } else {
                // Simple mock response - the entire object is the data
                responseData = mockResponse;
            }

            // If there's a response schema, validate the mock data
            if (responseSchema) {
                try {
                    responseSchema.parse(responseData);
                } catch (validationError) {
                    throw validationError;
                }
            }

            return {
                data: responseData,
                status: status,
                statusText: statusText,
                headers: headers
            };
        }

        // Default successful response
        return {
            data: {},
            status: 200,
            statusText: 'OK',
            headers: {}
        };
    }
}

/**
 * Create a test configuration
 */
export function createTestConfig(): CoolifyClientConfig {
    return {
        baseUrl: 'https://test.coolify.io/api/v1',
        apiToken: 'test-token',
        timeout: 5000
    };
}

/**
 * Load mock data from JSON files
 */
export async function loadMockData(filename: string): Promise<any> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const filePath = path.join(process.cwd(), 'workspace', 'mock-data', `${filename}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Assert that a validation error contains specific messages
 */
export function assertValidationError(error: any, expectedMessages: string[]): void {
    expect(error.name).toBe('ZodError');
    expect(error.errors).toBeDefined();

    const actualMessages = error.errors.map((e: any) => e.message);

    for (const expectedMessage of expectedMessages) {
        expect(actualMessages).toContain(expectedMessage);
    }
}

/**
 * Create a UUID for testing
 */
export function createTestUuid(): string {
    return '550e8400-e29b-41d4-a716-446655440000';
}

/**
 * Create multiple test UUIDs
 */
export function createTestUuids(count: number): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
        const uuid = `550e8400-e29b-41d4-a716-44665544${i.toString().padStart(4, '0')}`;
        uuids.push(uuid);
    }
    return uuids;
}
