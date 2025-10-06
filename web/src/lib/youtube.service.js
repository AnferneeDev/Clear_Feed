// This class is responsible for all communication with the YouTube Data API.
export class YouTubeService {
  static YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  static BASE_URL = 'https://www.googleapis.com/youtube/v3';

  /**
   * Finds a YouTube channel's ID and basic info from a handle or custom URL.
   * @param {string} id - The channel handle (e.g., "@MKBHD") or custom URL name.
   * @returns {Promise<{channelId: string, channelInfo: object}>}
   */
  static async findChannel(id) {
    const searchUrl = `${this.BASE_URL}/search?part=snippet&q=${id}&type=channel&key=${this.YOUTUBE_API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    const channel = data.items?.[0];

    if (!channel) {
      throw new Error('Channel not found.');
    }

    const channelInfo = {
      title: channel.snippet.title,
      thumbnail: channel.snippet.thumbnails.high.url,
    };

    // --- THE FIX IS HERE ---
    // We must return the final object.
    return {
      channelId: channel.id.channelId,
      channelInfo,
    };
  }

  /**
   * Gets the 50 most recent video uploads for a given channel ID.
   * @param {string} channelId - The unique ID of the YouTube channel (e.g., "UCBJycsmduvYEL83R_U4JriQ").
   * @returns {Promise<Array<object>>} - A list of video objects.
   */
  static async getVideosForChannel(channelId) {
    const searchUrl = `${this.BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video&key=${this.YOUTUBE_API_KEY}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    const videos = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return videos;
  }
}
