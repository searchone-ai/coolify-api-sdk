import { z } from 'zod';

/**
 * UUID validation schema with custom error message
 * Supports the custom 24-character format used by the API
 */
export const UuidSchema = z.string().regex(/^[a-z0-9]{24}$/, {
    message: "Must be a valid 24-character UUID format (lowercase letters and numbers only)"
});
