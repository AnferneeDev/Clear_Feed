// src/components/channel_view/FeedVideoCard.jsx

import Image from 'next/image';
import Link from 'next/link';

function formatDuration(durationSeconds) {
  if (durationSeconds == null || durationSeconds === 0) return '0:00';
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  const paddedSeconds = seconds.toString().padStart(2, '0');
  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}

// --- ADDED: Helper to format large numbers ---
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toLocaleString();
}

export function FeedVideoCard({ video, onVideoSelect }) {
  return (
    <div className="flex flex-col">
      <div
        onClick={() => onVideoSelect(video.id)}
        className="group cursor-pointer relative aspect-video overflow-hidden rounded-xl"
      >
        <Image
          src={video.thumbnail}
          alt={video.title}
          layout="fill"
          objectFit="cover"
          className="transform group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
          {formatDuration(video.durationSeconds)}
        </span>
      </div>
      <div className="mt-3 flex gap-3">
        <Link href={`/channel/${video.channelId || video.handle}`}>
          <Image
            src={video.channelThumbnail}
            alt={video.channelTitle}
            width={36}
            height={36}
            className="rounded-full flex-shrink-0 mt-1"
          />
        </Link>
        <div>
          <h3
            title={video.title}
            className="font-semibold text-base text-foreground leading-tight line-clamp-2 cursor-pointer group-hover:text-[var(--primarius)] transition-colors"
            onClick={() => onVideoSelect(video.id)}
          >
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors">
            {video.channelTitle}
          </p>
          {/* --- ADDED: Display view count and date --- */}
          <p className="text-sm text-muted-foreground mt-1">
            {formatNumber(video.viewCount)} views
            <span className="mx-1.5">&middot;</span>
            {new Date(video.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
