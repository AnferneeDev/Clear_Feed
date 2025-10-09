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
      const errorData = await response.json();
      const message =
        errorData.error?.message || `YouTube API error: ${response.status}`;
      throw new Error(message);
    }
    return response.json();
  }

  // --- Private Helper 1: Fetch Channel Details ---
  static async _fetchChannelDetails(handle) {
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    const url = `${this.BASE_URL}/channels?part=snippet,contentDetails,statistics,brandingSettings&forHandle=${cleanHandle}&key=${this.YOUTUBE_API_KEY}`;
    const data = await this._fetchJson(url);
    return data.items?.[0] || null;
  }

  // --- Private Helper 2: Fetch Playlist Videos ---
  static async _fetchPlaylistVideos(playlistId, pageToken = null) {
    let url = `${this.BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${this.YOUTUBE_API_KEY}`;
    if (pageToken) url += `&pageToken=${pageToken}`;
    return this._fetchJson(url);
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
  static async getChannelData(handle, pageToken = null) {
    const cacheKey = `channel:${handle}` + (pageToken ? `:${pageToken}` : '');

    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const channel = await this._fetchChannelDetails(handle);
    if (!channel) throw new Error('Channel not found.');
    const channelInfo = this._mapChannelInfo(channel);

    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const videosData = await this._fetchPlaylistVideos(
      uploadsPlaylistId,
      pageToken
    );

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

  // --- Public Orchestrator for the Main Feed ---
  static async getFeedForChannels(handles) {
    const allChannelsDataPromises = handles.map((handle) =>
      this.getChannelData(handle)
    );
    const allChannelsData = (await Promise.all(allChannelsDataPromises)).filter(
      Boolean
    );

    const allVideos = allChannelsData.flatMap((data) => {
      return data.videos.map((video) => ({
        ...video,
        channelThumbnail: data.channelInfo.thumbnail,
        channelTitle: data.channelInfo.title,
      }));
    });

    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return allVideos;
  }
}
