import { currentUser } from '@clerk/nextjs/server'; // --- UPDATED
import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('/**********************/');
  console.log('[FEED API] Received GET request.');

  // --- UPDATED: Use currentUser() for more reliability ---
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
    const history = user.publicMetadata.channelHistory || [];
    console.log('[FEED API] Fetched History from Clerk:', history);

    if (history.length === 0) {
      console.log('[FEED API] History array is empty, returning empty feed.');
      console.log('/**********************/');
      return NextResponse.json([]);
    }

    const handles = history.map((channel) => channel.id);
    console.log('[FEED API] Extracted handles for YouTube service:', handles);

    console.log('[FEED API] Calling YouTubeService.getFeedForChannels...');
    const feedVideos = await YouTubeService.getFeedForChannels(handles);
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
