// src/app/api/history/route.js
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('--- /api/history ENDPOINT WAS HIT ---');

  // FIXED: await auth() in App Router
  const { userId } = await auth();
  console.log('userId:', userId);

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

    // FIXED: await clerkClient() call
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const history = user.publicMetadata.channelHistory || [];

    // History Management Logic
    const filteredHistory = history.filter(
      (channel) => channel.id !== newChannel.id
    );

    const updatedHistory = [newChannel, ...filteredHistory];
    const finalHistory = updatedHistory.slice(0, 3);

    // FIXED: await clerkClient() call here too
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
