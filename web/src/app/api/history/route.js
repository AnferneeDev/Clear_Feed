// src/app/api/history/route.js
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('--- /api/history ENDPOINT WAS HIT ---');

  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const newChannel = await request.json();
    if (!newChannel || !newChannel.id || !newChannel.title) {
      return NextResponse.json(
        { message: 'Invalid channel data.' },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const history = user.publicMetadata.channelHistory || [];

    // ✅ Use handle for deduplication if available, otherwise fall back to id
    const uniqueKey = newChannel.handle || newChannel.id;

    // ✅ Check if this channel is already at the top
    if (history.length > 0) {
      const topChannelKey = history[0].handle || history[0].id;
      if (topChannelKey === uniqueKey) {
        console.log('Channel already at top of history, skipping update');
        return NextResponse.json({ success: true, history });
      }
    }

    // ✅ Remove any existing instances of this channel by handle (or id if no handle)
    const filteredHistory = history.filter((c) => {
      const channelKey = c.handle || c.id;
      return channelKey !== uniqueKey;
    });

    // ✅ Add new channel to the front and limit to 5
    const finalHistory = [newChannel, ...filteredHistory].slice(0, 5);

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        channelHistory: finalHistory,
      },
    });

    console.log('Updated history for user:', userId);
    console.log('History updated:', finalHistory);

    return NextResponse.json({ success: true, history: finalHistory });
  } catch (error) {
    console.error('Error updating history:', error);
    return NextResponse.json(
      { message: 'Error updating history.' },
      { status: 500 }
    );
  }
}
