'use client';

import Link from 'next/link';

// This component is shown when a channel has no videos.
export default function EmptyState({ channelInfo }) {
  return (
    <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-xl font-bold text-gray-700">{channelInfo.title}</h3>
      <p className="text-gray-600 mt-2">
        This channel doesn't have any videos yet.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block bg-[var(--primarius)] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Search for another channel
      </Link>
    </div>
  );
}
