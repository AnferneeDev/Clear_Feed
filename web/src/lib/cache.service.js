import { Redis } from '@upstash/redis';

// This is the error message that will be thrown if the Redis credentials are not found.
const CREDENTIALS_ERROR_MESSAGE =
  'Missing Upstash Redis credentials. Please check your .env.local file and restart your server.';

// This class is a wrapper around the Upstash Redis client.
// It provides a simple get/set interface and handles errors gracefully.
class CacheService {
  constructor() {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // If the credentials are not found, throw a clear error immediately.
    if (!redisUrl || !redisToken) {
      throw new Error(CREDENTIALS_ERROR_MESSAGE);
    }

    this.redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }

  /**
   * Retrieves a value from the cache for a given key.
   * @param {string} key - The key to look up in the cache.
   * @returns {Promise<any | null>} The cached value, or null if not found or an error occurs.
   */
  async get(key) {
    try {
      console.log(`REDIS GET for key: ${key}`);
      const data = await this.redis.get(key);
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  /**
   * Stores a value in the cache with a predefined expiration time.
   * @param {string} key - The key to store the value under.
   * @param {any} value - The value to be stored.
   */
  async set(key, value) {
    try {
      const CACHE_DURATION_SECONDS = 10 * 60; // 10 minutes

      // --- THE FIX IS HERE ---
      // We must pass the expiration time as the third argument in an options object.
      await this.redis.set(key, value, { ex: CACHE_DURATION_SECONDS });

      console.log(`CACHE SET for key: ${key}`);
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }
}

// Export a singleton instance so the whole app shares one cache connection.
export const cacheService = new CacheService();
