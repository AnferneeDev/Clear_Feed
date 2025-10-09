import { Redis } from '@upstash/redis';

const CREDENTIALS_ERROR_MESSAGE =
  'Missing Upstash Redis credentials. Please check your .env.local file and restart your server.';

class CacheService {
  constructor() {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      throw new Error(CREDENTIALS_ERROR_MESSAGE);
    }

    this.redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      console.log('/**********************/');
      if (data) {
        console.log(`[CACHE] HIT: ${key}`);
      } else {
        console.log(`[CACHE] MISS: ${key}`);
      }
      console.log('/**********************/');
      return data;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value) {
    try {
      const CACHE_DURATION_SECONDS = 60 * 60 * 24; // 10 minutes
      await this.redis.set(key, value, { ex: CACHE_DURATION_SECONDS });

      console.log('/**********************/');
      console.log(`[CACHE] SET: ${key}`);
      console.log('/**********************/');
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }
}

export const cacheService = new CacheService();
