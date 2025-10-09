import Image from 'next/image';

function formatDuration(durationSeconds) {
  if (durationSeconds == null || durationSeconds === 0) return '0:00';
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  const paddedSeconds = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${minutes}:${paddedSeconds}`;
  }
}

export function VideoCard({ video, onVideoSelect }) {
  return (
    <div
      key={video.id}
      onClick={() => onVideoSelect(video.id)}
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
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded">
          {formatDuration(video.durationSeconds)}
        </span>
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
  );
}
