"use client"; // <-- Add this for app router

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // <-- Changed from next/router

// Component for displaying a single video
function VideoCard({ video, onSelect }) {
  const { title, thumbnails } = video.snippet;
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group" onClick={() => onSelect(video.id.videoId)}>
      <img src={thumbnails.medium.url} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-md font-semibold text-white group-hover:text-red-400 transition-colors">{title}</h3>
      </div>
    </div>
  );
}

// Component for the video player modal
function VideoPlayer({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-full max-w-4xl aspect-video p-4" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="w-full h-full rounded-lg shadow-2xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default function ChannelPage() {
  const { id } = useParams(); // <-- Changed from router.query
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchChannelData = async () => {
      setLoading(true);
      setError("");
      try {
        // The API route will be at /api/channel now
        const response = await fetch(`/api/channel?id=${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch channel data.");
        }
        const data = await response.json();
        setChannelInfo(data.channelInfo);
        setVideos(data.videos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <>
      <VideoPlayer videoId={selectedVideoId} onClose={() => setSelectedVideoId(null)} />
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <div className="container mx-auto px-4 py-8">
          {channelInfo && (
            <div className="flex items-center space-x-4 mb-8">
              <img src={channelInfo.thumbnails.default.url} alt={channelInfo.title} className="w-20 h-20 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold">{channelInfo.title}</h1>
                <p className="text-gray-400">{channelInfo.customUrl}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id.videoId} video={video} onSelect={setSelectedVideoId} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
