import { Redis } from '@upstash/redis';

// Explicitly read environment variables to make debugging easier.
// This is the most common point of failure.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// If the credentials are not found, throw a clear error immediately.
if (!redisUrl || !redisToken) {
  throw new Error(
    'Missing Upstash Redis credentials. Please check your .env.local file and restart your server.'
  );
}

// Initialize the Redis client with the explicit credentials.
const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Cache duration in seconds (Redis uses seconds for expiration)
// 10 minutes = 600 seconds
const CACHE_DURATION_SECONDS = 10 * 60;

/**
 * Gets a value from the Redis cache. Returns null if not found.
 * @param {string} key The key to look up.
 * @returns {Promise<any | null>} The cached data or null.
 */
async function get(key) {
  try {
    const data = await redis.get(key);
    return data;
  } catch (error) {
    console.error(`Redis GET error for key "${key}":`, error.message);
    // In case of a Redis error, fail gracefully by returning null.
    // This allows the app to proceed by fetching fresh data from the API.
    return null;
  }
}

/**
 * Sets a value in the Redis cache with an expiration time.
 * @param {string} key The key to store the data under.
 * @param {any} data The data to store.
 */
async function set(key, data) {
  try {
    // 'ex' sets the expiration time in seconds.
    await redis.set(key, data, { ex: CACHE_DURATION_SECONDS });
  } catch (error) {
    console.error(`Redis SET error for key "${key}":`, error.message);
    // Fail gracefully on set as well. The app can function without the cache.
  }
}

export const cacheService = { get, set };
