'use client';

// This component is a pop-up modal that plays the selected video.
export default function VideoPlayer({ videoId, onClose }) {
  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl aspect-video p-4"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside the player
      >
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
