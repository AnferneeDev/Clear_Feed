import { cacheService } from './cache.service';

/**
 * Utility: Parse ISO 8601 duration (e.g., "PT2M7S") into seconds.
 */
function parseISO8601Duration(durationString) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationString.match(regex);
  const hours = parseInt(matches?.[1] || 0, 10);
  const minutes = parseInt(matches?.[2] || 0, 10);
  const seconds = parseInt(matches?.[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export class YouTubeService {
  static YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  static BASE_URL = 'https://www.googleapis.com/youtube/v3';

  // --- Core Fetch Helper ---
  static async _fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Try to parse error, but don't crash if it's not JSON
      const message =
        errorData.error?.message ||
        `YouTube API error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }
    // Defensive return: ensure it always returns an object, even if the response body is empty or malformed JSON
    return response.json().catch(() => ({}));
  }

  // --- Helper to find a channel by EITHER handle or ID ---
  static async _fetchChannelDetails({ handle, channelId }) {
    let url;
    if (handle) {
      const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
      url = `${this.BASE_URL}/channels?part=snippet,contentDetails,statistics,brandingSettings&forHandle=${cleanHandle}&key=${this.YOUTUBE_API_KEY}`;
    } else if (channelId) {
      url = `${this.BASE_URL}/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channelId}&key=${this.YOUTUBE_API_KEY}`;
    } else {
      return null;
    }
    console.log(
      '[YouTube API] Fetching channel URL:',
      url.replace(this.YOUTUBE_API_KEY, 'API_KEY')
    );
    const data = await this._fetchJson(url);
    console.log(
      '[YouTube API] Raw Channel response:',
      JSON.stringify(data, null, 2)
    );
    return data.items?.[0] || null;
  }

  // --- Helper to get channel ID from a video ID ---
  static async _fetchChannelIdFromVideo(videoId) {
    const url = `${this.BASE_URL}/videos?part=snippet&id=${videoId}&key=${this.YOUTUBE_API_KEY}`;
    const data = await this._fetchJson(url);
    return data.items?.[0]?.snippet?.channelId || null;
  }

  // --- Helper to resolve any input (URL or handle) to a channel object ---
  static async _getChannelFromIdentifier(identifier) {
    // --- THIS IS THE CHANGE: Check if it's a YouTube Channel ID first. ---
    // YouTube Channel IDs always start with "UC" and are typically 24 characters long.
    if (identifier.startsWith('UC') && identifier.length >= 24) {
      return this._fetchChannelDetails({ channelId: identifier });
    }

    let videoId = null;
    try {
      if (identifier.includes('youtube.com/watch')) {
        videoId = new URL(identifier).searchParams.get('v');
      } else if (identifier.includes('youtu.be/')) {
        videoId = new URL(identifier).pathname.substring(1).split('?')[0];
      }
    } catch (error) {
      // If URL parsing fails, it's not a valid URL, so treat as a handle
      return this._fetchChannelDetails({ handle: identifier });
    }

    if (videoId) {
      const channelId = await this._fetchChannelIdFromVideo(videoId);
      if (!channelId) {
        throw new Error(
          'Could not find a channel for the provided video link.'
        );
      }
      return this._fetchChannelDetails({ channelId });
    } else {
      // If it's neither a Channel ID nor a video URL, assume it's a channel handle
      return this._fetchChannelDetails({ handle: identifier });
    }
  }

  // --- Private Helper 2: Fetch Playlist Videos ---
  static async _fetchPlaylistVideos(playlistId, pageToken = null) {
    let url = `${this.BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${this.YOUTUBE_API_KEY}`;
    if (pageToken) url += `&pageToken=${pageToken}`;

    console.log(
      '[YouTube API] Fetching playlist videos URL:',
      url.replace(this.YOUTUBE_API_KEY, 'API_KEY')
    );
    let data;
    try {
      data = await this._fetchJson(url);
      console.log(
        '[YouTube API] Raw Playlist Videos response type (after _fetchJson):',
        typeof data
      );
      console.log(
        '[YouTube API] Raw Playlist Videos response (after _fetchJson):',
        JSON.stringify(data, null, 2)
      );
    } catch (e) {
      console.error(
        '[YouTube API] Error in _fetchPlaylistVideos during _fetchJson:',
        e
      );
      // Explicitly return empty data if _fetchJson throws
      return { items: [], nextPageToken: null };
    }

    // Defensive check: ensure a valid object structure is always returned
    if (!data || typeof data !== 'object' || !Array.isArray(data.items)) {
      console.warn(
        '[YouTube API] _fetchPlaylistVideos received unexpected final data format or missing items, returning empty playlist:',
        data
      );
      return { items: [], nextPageToken: null };
    }
    return data;
  }

  // --- Private Helper 3: Fetch Durations (with batching) ---
  static async _fetchVideoDurations(videoItems) {
    const videoIds = videoItems.map((item) => item.snippet.resourceId.videoId);
    const url = `${this.BASE_URL}/videos?part=contentDetails&id=${videoIds.join(',')}&key=${this.YOUTUBE_API_KEY}`;
    const data = await this._fetchJson(url);

    const durationMap = new Map();
    data.items.forEach((item) => {
      durationMap.set(
        item.id,
        parseISO8601Duration(item.contentDetails.duration)
      );
    });
    return durationMap;
  }

  // --- Mapping Helpers ---
  static _mapChannelInfo(channel) {
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high.url,
      subscriberCount: channel.statistics.subscriberCount,
      banner: channel.brandingSettings.image?.bannerExternalUrl || null,
    };
  }

  static _mapVideoInfo(item, durationMap) {
    const videoId = item.snippet.resourceId.videoId;
    return {
      id: videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      durationSeconds: durationMap.get(videoId) || 0,
    };
  }

  // --- Public Orchestrator for a single channel ---
  static async getChannelData(identifier, pageToken = null) {
    console.log('[getChannelData] Input identifier:', identifier);

    const channel = await this._getChannelFromIdentifier(identifier);
    console.log(
      '[getChannelData] Resolved channel:',
      channel ? channel.id : 'NULL'
    );

    if (!channel) throw new Error('Channel not found.');

    const channelId = channel.id;
    const cacheKey =
      `channel:${channelId}` + (pageToken ? `:${pageToken}` : '');

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const channelInfo = this._mapChannelInfo(channel);
    console.log('[getChannelData] Channel info mapped');
    console.log(
      '[getChannelData] Channel object:',
      JSON.stringify(channel, null, 2)
    );

    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      throw new Error('Could not find uploads playlist for this channel.');
    }
    console.log(
      '[getChannelData] Fetching videos from playlist:',
      uploadsPlaylistId
    );

    const videosData = await this._fetchPlaylistVideos(
      uploadsPlaylistId,
      pageToken
    );
    // console.log('[getChannelData] Videos data:', videosData); // This log is now redundant after _fetchPlaylistVideos updates

    if (!videosData.items || videosData.items.length === 0) {
      const emptyResponse = { channelInfo, videos: [], nextPageToken: null };
      cacheService.set(cacheKey, emptyResponse).catch(console.error);
      return emptyResponse;
    }

    const durationMap = await this._fetchVideoDurations(videosData.items);

    const videos = videosData.items
      .map((item) => this._mapVideoInfo(item, durationMap))
      .filter((video) => video.durationSeconds > 120);

    const responseData = {
      channelInfo,
      videos,
      nextPageToken: videosData.nextPageToken || null,
    };

    cacheService.set(cacheKey, responseData).catch(console.error);

    return responseData;
  }

  // --- Public Orchestrator for the Main Feed (no changes) ---
  static async getFeedForChannels(handles) {
    const allChannelsDataPromises = handles.map((handle) =>
      this.getChannelData(handle)
    );
    const allChannelsData = (await Promise.all(allChannelsDataPromises)).filter(
      Boolean
    );

    const allVideos = allChannelsData.flatMap((data) => {
      // Ensure data.videos is an array before mapping
      const videos = Array.isArray(data.videos) ? data.videos : [];
      return videos.map((video) => ({
        ...video,
        channelThumbnail: data.channelInfo.thumbnail,
        channelTitle: data.channelInfo.title,
      }));
    });

    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return allVideos;
  }
}
