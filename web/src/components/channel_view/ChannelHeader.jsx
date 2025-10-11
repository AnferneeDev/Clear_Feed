import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { ShinyButton } from '../magicui';
import { cn } from '@/lib/utils';

export function ChannelHeader({ channelInfo, isFollowing, onFollowToggle }) {
  if (!channelInfo) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
      <Image
        src={channelInfo.thumbnail}
        alt={channelInfo.title}
        width={128}
        height={128}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg -mt-8 sm:-mt-12"
      />
      <div className="text-center sm:text-left flex-grow">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          {channelInfo.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {Number(channelInfo.subscriberCount).toLocaleString()} subscribers
        </p>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {channelInfo.description}
        </p>
      </div>

      <div className="sm:ml-auto">
        <ShinyButton
          onClick={onFollowToggle}
          className={cn(isFollowing ? 'bg-gray-200' : 'bg-black')}
        >
          <div className="flex items-center gap-2">
            {isFollowing ? (
              <>
                <Check className="h-4 w-4 font-bold text-black dark:text-black" />
                <span className="text-black font-bold dark:text-black">
                  Following
                </span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 font-bold text-white dark:text-white" />
                <span className="text-white font-bold dark:text-white">
                  Follow
                </span>
              </>
            )}
          </div>
        </ShinyButton>
      </div>
    </div>
  );
}
