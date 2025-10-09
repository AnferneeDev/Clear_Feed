import Image from 'next/image';

export function ChannelHeader({ channelInfo }) {
  if (!channelInfo) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
      <Image
        src={channelInfo.thumbnail}
        alt={channelInfo.title}
        width={128}
        height={128}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg -mt-16 sm:-mt-20"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-[var(--secundarius)]">
          {channelInfo.title}
        </h1>
        <p className="text-sm text-gray-500">
          {Number(channelInfo.subscriberCount).toLocaleString()} subscribers
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {channelInfo.description}
        </p>
      </div>
    </div>
  );
}
