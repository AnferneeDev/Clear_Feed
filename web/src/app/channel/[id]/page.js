// src/app/channel/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
  LoadingSpinner,
  ErrorDisplay,
  EmptyState,
  VideoPlayer,
} from '@/components/channel_id/index';

import { AppLayout } from '@/components/youtube_layout/index';
import ShimmerButton from '@/components/magicui/shimmer-button';

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

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      setChannelData(null);
      setNextPageToken(null);

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

          // --- OPTIMIZED: Save to history immediately ---
          if (user && data.channelInfo) {
            saveToHistory(data.channelInfo);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchChannelData();
    }
  }, [id, user]);

  // Separate function for saving history
  const saveToHistory = async (channelInfo) => {
    try {
      console.log('💾 Saving to history:', channelInfo.title);

      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          title: channelInfo.title,
          thumbnail: channelInfo.thumbnail,
        }),
        cache: 'no-store',
      });

      if (historyResponse.ok) {
        console.log('✅ History saved successfully');

        // Force immediate reload of user data
        if (user?.reload) {
          await user.reload();
          console.log('✅ User data reloaded');
        }
      } else {
        const errorText = await historyResponse.text();
        console.error('❌ Failed to save history:', errorText);
      }
    } catch (err) {
      console.error('❌ Error saving history:', err);
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const response = await fetch(
        `/api/channel?id=${decodeURIComponent(id)}&pageToken=${nextPageToken}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      const data = await response.json();
      setChannelData((prevData) => ({
        ...prevData,
        videos: [...prevData.videos, ...data.videos],
      }));
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error('Failed to load more videos:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderMainContent = () => {
    if (isLoading)
      return (
        <div className="p-8">
          <LoadingSpinner />
        </div>
      );
    if (error)
      return (
        <div className="p-8">
          <ErrorDisplay message={error} />
        </div>
      );
    if (channelData && channelData.videos.length === 0) {
      return (
        <div className="p-8">
          <EmptyState channelInfo={channelData.channelInfo} />
        </div>
      );
    }
    if (channelData) {
      return (
        <div>
          <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <Image
                src={channelData.channelInfo.thumbnail}
                alt={channelData.channelInfo.title}
                width={128}
                height={128}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg -mt-16 sm:-mt-20"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl md:text-4xl font-bold text-[var(--secundarius)]">
                  {channelData.channelInfo.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {Number(
                    channelData.channelInfo.subscriberCount
                  ).toLocaleString()}{' '}
                  subscribers
                </p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {channelData.channelInfo.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
              {channelData.videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideoId(video.id)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      layout="fill"
                      objectFit="cover"
                      className="transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-base text-[var(--secundarius)] leading-tight truncate group-hover:text-[var(--primarius)] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(video.publishedAt).toLocaleDateString('en-CA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              {isLoadingMore ? (
                <LoadingSpinner />
              ) : (
                nextPageToken && (
                  <ShimmerButton
                    className="shadow-2xl"
                    onClick={handleLoadMore}
                  >
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                      Load More
                    </span>
                  </ShimmerButton>
                )
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <VideoPlayer
        videoId={selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
      />
      <AppLayout channelData={channelData}>{renderMainContent()}</AppLayout>
    </>
  );
}
