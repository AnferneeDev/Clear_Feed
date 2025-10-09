import { LoadingSpinner } from '@/components/channel_id/index';
import ShimmerButton from '@/components/magicui/shimmer-button';

export function LoadMoreButton({ isLoadingMore, nextPageToken, onLoadMore }) {
  return (
    <div className="mt-12 flex justify-center">
      {isLoadingMore ? (
        <LoadingSpinner />
      ) : (
        nextPageToken && (
          <ShimmerButton className="shadow-2xl" onClick={onLoadMore}>
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Load More
            </span>
          </ShimmerButton>
        )
      )}
    </div>
  );
}
