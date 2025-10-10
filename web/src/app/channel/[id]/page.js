'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
import {
  ChannelHeader,
  VideoGrid,
  FilterControls,
} from '@/components/channel_view/index';
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

  const [sortBy, setSortBy] = useState('newest');
  const [durationRange, setDurationRange] = useState([2, 60]);

  const [loadMoreRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
  });

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

  useEffect(() => {
    if (user && channelData?.channelInfo && !historySavedRef.current) {
      historySavedRef.current = channelData.channelInfo.id;
      saveChannelToHistory(
        {
          id: channelData.channelInfo.id,
          title: channelData.channelInfo.title,
          thumbnail: channelData.channelInfo.thumbnail,
        },
        user
      );
    }
  }, [channelData, user]);

  const handleLoadMore = useCallback(async () => {
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
  }, [id, isLoadingMore, nextPageToken]);

  useEffect(() => {
    if (isIntersecting && !isLoading) {
      handleLoadMore();
    }
  }, [isIntersecting, isLoading, handleLoadMore]);

  const filteredAndSortedVideos = useMemo(() => {
    if (!channelData?.videos) return [];

    const [min, max] = durationRange;
    const filtered = channelData.videos.filter((video) => {
      const durationMinutes = video.durationSeconds / 60;

      const isAboveMin = durationMinutes >= min;
      const isBelowMax = max >= 60 ? true : durationMinutes <= max;

      return isAboveMin && isBelowMax;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);

      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA;
    });
  }, [channelData?.videos, sortBy, durationRange]);

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
            <FilterControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              durationRange={durationRange}
              setDurationRange={setDurationRange}
              showSlider={false}
            />
            {filteredAndSortedVideos.length > 0 ? (
              <VideoGrid
                videos={filteredAndSortedVideos}
                onVideoSelect={setSelectedVideoId}
              />
            ) : (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-[var(--secundarius)]">
                  No videos match your filters
                </h2>
                <p className="text-gray-500 mt-2">
                  Try adjusting the duration range.
                </p>
              </div>
            )}
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
