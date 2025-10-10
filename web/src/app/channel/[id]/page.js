'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { saveChannelToHistory } from '@/lib/user.service';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  VideoPlayer,
} from '@/components/channel_id/index';
import { AppLayout } from '@/components/youtube_layout/index';
import { ChannelHeader, VideoGrid } from '@/components/channel_view/index';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

export default function ChannelPage() {
  const { user } = useUser();
  const params = useParams();
  const id = params.id;

  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const historySavedRef = useRef(false);

  const [loadMoreRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
  });

  // Data Fetching Effect
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setChannelData(null);
    setNextPageToken(null);
    historySavedRef.current = false;

    const fetchChannelData = async () => {
      try {
        const response = await fetch(
          `/api/channel?id=${decodeURIComponent(id)}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error: ${response.status}`);
        }
        const data = await response.json();
        setChannelData(data);
        setNextPageToken(data.nextPageToken);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChannelData();
  }, [id]);

  // History Saving Effect
  useEffect(() => {
    if (user && channelData?.channelInfo && !historySavedRef.current) {
      historySavedRef.current = true;
      saveChannelToHistory(
        {
          id: id,
          title: channelData.channelInfo.title,
          thumbnail: channelData.channelInfo.thumbnail,
        },
        user
      );
    }
  }, [channelData, user, id]);

  // Load More Logic
  const handleLoadMore = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await fetch(
        `/api/channel?id=${decodeURIComponent(id)}&pageToken=${nextPageToken}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch more videos');
      }
      const data = await response.json();
      setChannelData((prevData) => ({
        ...prevData,
        videos: [...prevData.videos, ...data.videos],
      }));
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Effect to trigger loading more videos
  useEffect(() => {
    if (isIntersecting && nextPageToken && !isLoadingMore && !isLoading) {
      handleLoadMore();
    }
  }, [isIntersecting, nextPageToken, isLoading, isLoadingMore]);

  return (
    <>
      <VideoPlayer
        videoId={selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
      />

      <AppLayout channelData={channelData}>
        {isLoading && (
          <div className="p-8 flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="p-8">
            <ErrorDisplay message={error} />
          </div>
        )}
        {!isLoading &&
          !error &&
          (!channelData || channelData.videos.length === 0) && (
            <div className="p-8">
              <EmptyState channelInfo={channelData?.channelInfo} />
            </div>
          )}
        {!isLoading && !error && channelData?.videos?.length > 0 && (
          <div className="p-4 md:p-8">
            <ChannelHeader channelInfo={channelData.channelInfo} />
            <VideoGrid
              videos={channelData.videos}
              onVideoSelect={setSelectedVideoId}
            />

            {/* --- UPDATED: Taller trigger area to prevent layout shift --- */}
            <div
              ref={loadMoreRef}
              className="h-40 mt-8 flex justify-center items-start"
            >
              {isLoadingMore && nextPageToken && <LoadingSpinner />}
            </div>
          </div>
        )}
      </AppLayout>
    </>
  );
}
