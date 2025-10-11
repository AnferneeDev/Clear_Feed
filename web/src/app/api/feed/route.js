import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('/**********************/');
  console.log('[FEED API] Received GET request.');

  const user = await currentUser();
  console.log(
    '[FEED API] User object from currentUser():',
    user?.id || 'Not found'
  );

  if (!user) {
    console.log('[FEED API] No user found, returning empty feed.');
    console.log('/**********************/');
    return NextResponse.json([]);
  }

  try {
    // --- UPDATED: Use followedChannels instead of channelHistory ---
    const followedChannels = user.publicMetadata.followedChannels || [];
    console.log(
      '[FEED API] Fetched Followed Channels from Clerk:',
      followedChannels
    );

    if (followedChannels.length === 0) {
      console.log(
        '[FEED API] Followed Channels array is empty, returning empty feed.'
      );
      console.log('/**********************/');
      return NextResponse.json([]);
    }

    // The 'id' property here is the unique YouTube Channel ID (UC...)
    const channelIds = followedChannels.map((channel) => channel.id);
    console.log(
      '[FEED API] Extracted Channel IDs for YouTube service:',
      channelIds
    );

    console.log('[FEED API] Calling YouTubeService.getFeedForChannels...');
    const feedVideos = await YouTubeService.getFeedForChannels(channelIds);
    console.log('[FEED API] Final feed video count:', feedVideos.length);
    console.log('/**********************/');

    return NextResponse.json(feedVideos);
  } catch (error) {
    console.error('[FEED API] CRITICAL ERROR:', error);
    console.log('/**********************/');
    return NextResponse.json(
      { message: 'Error fetching feed.' },
      { status: 500 }
    );
  }
}
