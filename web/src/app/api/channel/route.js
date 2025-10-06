import { NextResponse } from "next/server";
import { YouTubeService } from "@/lib/youtube.service";
import { cacheService } from "@/lib/cache.service"; // Use the Redis cache service

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Channel identifier is required." }, { status: 400 });
  }

  const cacheKey = `channel:${id}`;

  try {
    // 1. Check the Redis cache first
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      console.log(`CACHE HIT for key: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }
    console.log(`CACHE MISS for key: ${cacheKey}`);

    // 2. If not in cache, call the YouTube Service
    const { channelId, channelInfo } = await YouTubeService.findChannel(id);
    const videos = await YouTubeService.getVideosForChannel(channelId);

    const responseData = { channelInfo, videos };

    // 3. Store the fresh data in the Redis cache for next time
    // We use a "fire-and-forget" approach for the cache set operation
    cacheService.set(cacheKey, responseData).catch(console.error);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: error.message.includes("not found") ? 404 : 500 });
  }
}
