'use client';

import Image from 'next/image'; // --- THE FIX IS HERE ---

// This is the left sidebar to show followed channels
export default function Sidebar({ channelData }) {
  // For now, it just shows the currently viewed channel as a placeholder
  const channels = channelData ? [channelData.channelInfo] : [];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white/50 p-4">
      <h2 className="text-lg font-semibold mb-4">Following</h2>
      <nav className="flex flex-col gap-2">
        {channels.map((channel) => (
          <div
            key={channel.title}
            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2"
          >
            <Image
              src={channel.thumbnail}
              alt={channel.title}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-medium truncate">{channel.title}</span>
          </div>
        ))}
        {/* In the future, the list of all followed channels would be mapped here */}
      </nav>
    </aside>
  );
}
