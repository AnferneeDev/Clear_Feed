// src/lib/user.service.js

/**
 * Saves a visited channel to the user's history via the API.
 * After saving, it reloads the user object to get the latest metadata.
 * @param {object} channel - The channel object with { id, title, thumbnail }.
 * @param {object} user - The user object from Clerk's useUser() hook.
 */
export const saveChannelToHistory = async (channel, user) => {
  if (!user || !channel) return;

  try {
    const response = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(channel),
      cache: 'no-store',
    });

    if (response.ok) {
      console.log('✅ History saved, reloading user data...');
      // Force immediate reload of the user object to get the new history
      if (user.reload) await user.reload();
    } else {
      const errorText = await response.text();
      console.error('❌ Failed to save history:', errorText);
    }
  } catch (err) {
    console.error('❌ Error saving history:', err);
  }
};

/**
 * Safely retrieves the channel history from the user's metadata.
 * @param {object} user - The user object from Clerk's useUser() hook.
 * @returns {Array} The user's channel history, or an empty array.
 */
export const getChannelHistory = (user) => {
  const history = user?.publicMetadata?.channelHistory || [];

  // Client-side deduplication as a safety net
  const deduplicated = history.reduce((acc, channel) => {
    if (!acc.find((c) => c.id === channel.id)) {
      acc.push(channel);
    }
    return acc;
  }, []);

  return deduplicated;
};
