"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      // Basic URL validation
      const url = new URL(channelUrl);
      if (url.hostname !== "www.youtube.com" && url.hostname !== "youtube.com") {
        setError("Please enter a valid YouTube channel URL.");
        return;
      }

      // Extract the channel identifier from the path
      // Handles formats like /c/name, /@name, and /channel/ID
      const pathParts = url.pathname.split("/").filter((part) => part);
      if (pathParts.length < 1) {
        setError("Could not find a channel identifier in the URL.");
        return;
      }

      // The identifier is the last part of the path
      const channelIdentifier = pathParts[pathParts.length - 1];
      router.push(`/channel/${channelIdentifier}`);
    } catch (err) {
      setError("Invalid URL format. Please enter a full YouTube channel URL.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-red-500">YouTube Focus</h1>
        <p className="text-center text-gray-400">Paste a channel URL to see its videos without the distractions.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="channel-url" className="sr-only">
              Channel URL
            </label>
            <input
              id="channel-url"
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="e.g., https://www.youtube.com/@mkbhd"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none transition"
              required
            />
          </div>
          {error && <p className="text-sm text-yellow-400 text-center">{error}</p>}
          <button type="submit" className="w-full px-4 py-3 font-semibold bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition duration-300">
            Find Videos
          </button>
        </form>
      </div>
    </div>
  );
}
