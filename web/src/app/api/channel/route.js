import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube.service';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const pageToken = searchParams.get('pageToken');

  if (!id) {
    return NextResponse.json(
      { message: 'Channel identifier is required.' },
      { status: 400 }
    );
  }

  try {
    // The service handles caching internally with the proper channel ID
    const responseData = await YouTubeService.getChannelData(id, pageToken);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Route Error:', error.message);
    return NextResponse.json(
      { message: error.message },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}
