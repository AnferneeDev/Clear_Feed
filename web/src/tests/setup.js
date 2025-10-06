import { vi } from 'vitest';

// Set dummy environment variables for the test environment
// This prevents the cache service from throwing an error during import.
process.env.UPSTASH_REDIS_REST_URL = 'dummy_url';
process.env.UPSTASH_REDIS_REST_TOKEN = 'dummy_token';
