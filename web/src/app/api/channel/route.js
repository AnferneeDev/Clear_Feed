import { NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube.service';
import { cacheService } from '@/lib/cache.service';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // --- UPDATED: Get the pageToken from the request URL ---
  const pageToken = searchParams.get('pageToken');

  if (!id) {
    return NextResponse.json(
      { message: 'Channel identifier is required.' },
      { status: 400 }
    );
  }

  // --- UPDATED: Make the cache key unique for each page ---
  let cacheKey = `channel:${id}`;
  if (pageToken) {
    cacheKey += `:${pageToken}`;
  }

  try {
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT for key: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }
    console.log(`CACHE MISS for key: ${cacheKey}`);

    // --- UPDATED: Pass the pageToken to the service call ---
    const responseData = await YouTubeService.getChannelData(id, pageToken);

    cacheService.set(cacheKey, responseData).catch(console.error);
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Route Error:', error.message);
    return NextResponse.json(
      { message: error.message },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}
