'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

// --- UI Components for different states ---

// A loading spinner component (pure SVG, no libraries)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full py-20">
    <svg
      className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

// A component to show when an error occurs
const ErrorDisplay = ({ message }) => (
  <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-xl font-bold text-red-700">Something went wrong</h3>
    <p className="text-red-600 mt-2">{message}</p>
    <Link
      href="/"
      className="mt-4 inline-block bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Go Back Home
    </Link>
  </div>
);

// A component to show when a channel has no videos
const EmptyState = ({ channelInfo }) => (
  <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
    <h3 className="text-xl font-bold text-gray-700">{channelInfo.title}</h3>
    <p className="text-gray-600 mt-2">
      This channel doesn't have any videos yet.
    </p>
    <Link
      href="/"
      className="mt-4 inline-block bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Search for another channel
    </Link>
  </div>
);

// --- Main Channel Page Component ---

export default function ChannelPage() {
  const params = useParams();
  const id = params.id;

  // Decode the channel ID from the URL to handle special characters like '@'
  const decodedId = id ? decodeURIComponent(id) : '';

  // State to manage the channel data, loading status, and errors
  const [channelData, setChannelData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure we only fetch data if an ID is present
    if (decodedId) {
      // Reset state for new channel navigation
      setIsLoading(true);
      setError(null);
      setChannelData(null);

      const fetchChannelData = async () => {
        try {
          const response = await fetch(`/api/channel?id=${decodedId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status}`);
          }
          const data = await response.json();
          setChannelData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchChannelData();
    }
  }, [decodedId]); // Re-run the effect if the channel ID changes

  // --- Conditional Rendering Logic ---

  // 1. Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <LoadingSpinner />
      </main>
    );
  }

  // 2. Show an error message if the fetch failed
  if (error) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <ErrorDisplay message={error} />
      </main>
    );
  }

  // 3. Handle the case where the channel exists but has no videos
  if (channelData && channelData.videos.length === 0) {
    return (
      <main className="container mx-auto p-4 md:p-8">
        <EmptyState channelInfo={channelData.channelInfo} />
      </main>
    );
  }

  // 4. If everything is successful, render the channel content
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        {channelData && (
          <>
            {/* Channel Header */}
            <div className="flex items-center gap-4 mb-8">
              <img
                src={channelData.channelInfo.thumbnail}
                alt={channelData.channelInfo.title}
                className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                  {channelData.channelInfo.title}
                </h1>
                <a
                  href={`https://www.youtube.com/${decodedId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on YouTube
                </a>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {channelData.videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 leading-tight truncate">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
