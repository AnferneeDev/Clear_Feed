import { VideoCard } from './VideoCard';

export function VideoGrid({ videos, onVideoSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onVideoSelect={onVideoSelect} />
      ))}
    </div>
  );
}
