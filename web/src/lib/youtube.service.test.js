import { describe, it, expect, vi, afterEach } from 'vitest';
import { YouTubeService } from './youtube.service';

// We are "mocking" the global fetch function.
// This means any time our code calls fetch(), our test will intercept it.
global.fetch = vi.fn();

// The describe block groups together related tests for our YouTubeService.
describe('YouTubeService', () => {
  // afterEach is a cleanup function that runs after every single test.
  // Here, we reset the mock to make sure tests don't interfere with each other.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 'it' defines a single test case. The string explains what the test should do.
  it('should find a channel ID and channel info for a given handle', async () => {
    // --- ARRANGE ---
    // We define what we expect the fake YouTube API to return.
    const mockApiResponse = {
      items: [
        {
          id: { channelId: 'UC-test-channel-id' },
          snippet: {
            title: 'Test Channel',
            thumbnails: { high: { url: 'http://example.com/image.jpg' } },
          },
        },
      ],
    };

    // We tell our mocked fetch to return our fake response.
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    // --- ACT ---
    // We call the actual function we want to test.
    const result = await YouTubeService.findChannel('@TestChannel');

    // --- ASSERT ---
    // We use 'expect' to make assertions about the result.
    // Did our function correctly process the fake data?
    expect(result.channelId).toBe('UC-test-channel-id');
    expect(result.channelInfo.title).toBe('Test Channel');
    expect(result.channelInfo.thumbnail).toBe('http://example.com/image.jpg');

    // We can also assert that fetch was called correctly.
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('@TestChannel'));
  });

  it('should throw an error if the channel is not found', async () => {
    // --- ARRANGE ---
    // In this test, we simulate the API returning an empty list.
    const mockApiResponse = { items: [] };
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    // --- ACT & ASSERT ---
    // We expect that calling findChannel will throw an error.
    // Vitest's 'rejects.toThrow()' is the correct way to test for errors.
    await expect(YouTubeService.findChannel('@NotFound')).rejects.toThrow(
      'Channel not found.'
    );
  });
});
