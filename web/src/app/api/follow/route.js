import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const channelToToggle = await request.json();
    if (!channelToToggle || !channelToToggle.id) {
      return NextResponse.json(
        { message: 'Invalid channel data.' },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const followedChannels = user.publicMetadata.followedChannels || [];

    const isAlreadyFollowing = followedChannels.some(
      (c) => c.id === channelToToggle.id
    );

    let updatedFollowedChannels;
    let action;

    if (isAlreadyFollowing) {
      // UNFOLLOW LOGIC: Remove the channel from the list
      updatedFollowedChannels = followedChannels.filter(
        (c) => c.id !== channelToToggle.id
      );
      action = 'unfollowed';
    } else {
      // FOLLOW LOGIC: Add the channel, but check the limit first
      if (followedChannels.length >= 5) {
        return NextResponse.json(
          {
            message:
              'Follow limit reached. Upgrade to Pro to follow more channels.',
          },
          { status: 403 }
        );
      }
      updatedFollowedChannels = [channelToToggle, ...followedChannels];
      action = 'followed';
    }

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        followedChannels: updatedFollowedChannels,
      },
    });

    return NextResponse.json({
      success: true,
      action: action,
      followedChannels: updatedFollowedChannels,
    });
  } catch (error) {
    console.error('Error updating follow list:', error.message);
    return NextResponse.json(
      { message: 'Error updating follow list.' },
      { status: 500 }
    );
  }
}
