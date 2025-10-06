import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Redis } from '@upstash/redis';
import { cacheService } from './cache.service';

// Mock the entire Upstash Redis client
vi.mock('@upstash/redis', () => {
  // We need to create a fake Redis class with fake 'get' and 'set' methods
  const mockRedis = {
    get: vi.fn(),
    set: vi.fn(),
  };
  return {
    Redis: vi.fn(() => mockRedis),
  };
});

// Get a reference to our mocked Redis instance to check if it's called correctly
const mockRedisInstance = new Redis();

describe('cacheService', () => {
  // Before each test, clear any previous mock calls to ensure a clean slate
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call redis.get with the correct key', async () => {
    // --- ARRANGE ---
    const testKey = 'test-key';
    // We can make the mock return a specific value for this test
    mockRedisInstance.get.mockResolvedValue({ message: 'hello from cache' });

    // --- ACT ---
    await cacheService.get(testKey);

    // --- ASSERT ---
    // We expect that the 'get' method on our fake Redis client was called exactly once...
    expect(mockRedisInstance.get).toHaveBeenCalledTimes(1);
    // ...and that it was called with the key we provided.
    expect(mockRedisInstance.get).toHaveBeenCalledWith(testKey);
  });

  it('should call redis.set with the correct key, value, and expiration', async () => {
    // --- ARRANGE ---
    const testKey = 'test-key';
    const testValue = { data: 'some-data' };
    const CACHE_DURATION_SECONDS = 600; // 10 minutes

    // --- ACT ---
    await cacheService.set(testKey, testValue);

    // --- ASSERT ---
    // We expect that the 'set' method on our fake Redis client was called exactly once...
    expect(mockRedisInstance.set).toHaveBeenCalledTimes(1);
    // ...and that it was called with the correct parameters.
    expect(mockRedisInstance.set).toHaveBeenCalledWith(testKey, testValue, {
      ex: CACHE_DURATION_SECONDS,
    });
  });

  it('should return null if redis.get throws an error', async () => {
    // --- ARRANGE ---
    const testKey = 'test-key';
    // We tell our mock to simulate an error when 'get' is called
    mockRedisInstance.get.mockRejectedValue(
      new Error('Redis connection failed')
    );

    // --- ACT ---
    const result = await cacheService.get(testKey);

    // --- ASSERT ---
    // We expect our service to gracefully handle the error and return null.
    expect(result).toBeNull();
  });
});
