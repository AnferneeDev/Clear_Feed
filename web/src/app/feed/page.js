// src/app/feed/page.js
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { AppLayout } from '@/components/youtube_layout/index';
import {
  VideoPlayer,
  LoadingSpinner,
  ErrorDisplay,
} from '@/components/channel_id/index';
import { FeedVideoCard } from '@/components/channel_view/index';
import Link from 'next/link';

function FeedGrid({ videos, onVideoSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {videos.map((video) => (
        <FeedVideoCard
          key={video.id}
          video={video}
          onVideoSelect={onVideoSelect}
        />
      ))}
    </div>
  );
}

function FeedEmptyState({ isSignedIn }) {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-[var(--secundarius)]">
        Your Feed is Empty
      </h2>
      {isSignedIn ? (
        <p className="text-gray-500 mt-2">
          Visit a few channel pages to start building your feed.
        </p>
      ) : (
        <p className="text-gray-500 mt-2">
          <Link
            href="/sign-in"
            className="text-[var(--primarius)] hover:underline"
          >
            Sign in
          </Link>{' '}
          to build a personalized feed.
        </p>
      )}
    </div>
  );
}

export default function FeedPage() {
  // --- UPDATED: Get isLoaded and isSignedIn from useUser ---
  const { isLoaded, isSignedIn } = useUser();
  const [feedVideos, setFeedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // --- UPDATED: useEffect now waits for Clerk to be loaded ---
  useEffect(() => {
    // Don't do anything until Clerk has loaded the user session
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchFeed = async () => {
      try {
        const response = await fetch('/api/feed', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch feed.');
        }
        const data = await response.json();
        setFeedVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [isLoaded, isSignedIn]); // --- UPDATED: Depend on isLoaded ---

  return (
    <>
      <VideoPlayer
        videoId={selectedVideoId}
        onClose={() => setSelectedVideoId(null)}
      />
      <AppLayout>
        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold text-[var(--secundarius)] mb-8">
            Your Feed
          </h1>

          {isLoading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          {error && <ErrorDisplay message={error} />}

          {!isLoading &&
            !error &&
            (feedVideos.length > 0 ? (
              <FeedGrid
                videos={feedVideos}
                onVideoSelect={setSelectedVideoId}
              />
            ) : (
              <FeedEmptyState isSignedIn={isSignedIn} />
            ))}
        </div>
      </AppLayout>
    </>
  );
}
