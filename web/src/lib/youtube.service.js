const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Finds a YouTube channel by its handle or ID.
 * @param {string} identifier - The channel's handle (e.g., "@MKBHD") or ID.
 * @returns {Promise<{channelId: string, channelInfo: object}>}
 */
async function findChannel(identifier) {
  let channelId = identifier;
  let channelInfo = null;

  // If the identifier starts with '@', it's a handle. We need to find its ID.
  if (identifier.startsWith("@")) {
    const handle = identifier.substring(1);
    const searchUrl = `${YOUTUBE_API_URL}/search?part=snippet&q=${handle}&type=channel&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      throw new Error("Channel not found.");
    }
    channelId = searchData.items[0].snippet.channelId;
    channelInfo = searchData.items[0].snippet;
  } else {
    // If it's not a handle, assume it's an ID and fetch its data.
    const channelUrl = `${YOUTUBE_API_URL}/channels?part=snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("Channel not found.");
    }
    channelInfo = channelData.items[0].snippet;
  }

  return { channelId, channelInfo };
}

/**
 * Gets the 50 most recent video uploads for a given channel ID.
 * @param {string} channelId - The ID of the channel.
 * @returns {Promise<Array<object>>} - A list of video objects.
 */
async function getVideosForChannel(channelId) {
  const videoSearchUrl = `${YOUTUBE_API_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=50&key=${YOUTUBE_API_KEY}`;
  const videoResponse = await fetch(videoSearchUrl);
  const videoData = await videoResponse.json();
  return videoData.items || [];
}

export const YouTubeService = {
  findChannel,
  getVideosForChannel,
};
