'use client';

import { Input } from '@/components/ui/input';
import {
  AnimatedGridPattern,
  BoxReveal,
  Highlighter,
  RainbowButton,
} from '@/components/magicui/index';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function HeroSection({
  handleSearch,
  channelUrl,
  setChannelUrl,
  isLoading,
  error,
}) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6 py-10">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]',
          'h-full w-full skew-y-12'
        )}
      />
      <div className="flex flex-col items-center justify-center max-w-2xl z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Stop{' '}
          <Highlighter color={'var(--primarius)'} action="highlight">
            wasting time
          </Highlighter>
          . <br /> Watch only{' '}
          <Highlighter color={'var(--primarius)'}>what matters</Highlighter>.
        </h1>

        <BoxReveal boxColor={'var(--primarius)'} duration={0.5}>
          <p className="mt-4 text-lg md:text-xl opacity-80 max-w-xl">
            Reclaim your attention — Clear Feed removes autoplay, clickbait, and
            distractions. Build your own focused YouTube feed, powered by your
            choices, not the algorithm.
          </p>
        </BoxReveal>

        {/* --- UPGRADED SEARCH BAR --- */}
        {/* This outer div creates the gradient border effect */}
        <div className="relative mt-8 w-full max-w-xl rounded-lg bg-gradient-to-r from-[var(--primarius)] via-purple-500 to-red-500 p-[1px] focus-within:ring-2 focus-within:ring-[var(--primarius)] transition-all duration-300 ">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch gap-3 w-full bg-[var(--neuter)] p-2 rounded-[7px]" // Inner background
          >
            <Input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Paste a YouTube channel URL, video URL, or @handle"
              className="py-6 text-base rounded-full sm:flex-grow h-12 bg-gray-300 dark:bg-white dark:text-black border-none focus-visible:ring-0 focus-visible:ring-offset-0" // Transparent with no focus ring
            />
            <RainbowButton
              type="submit" // --- THE FUNCTIONAL FIX ---
              disabled={isLoading}
              className="mt-2"
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:text-black lg:text-base">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  'Search channel'
                )}
              </span>
            </RainbowButton>
          </form>
        </div>

        {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
        <p className="mt-3 text-sm opacity-70">
          No autoplay · No recommendations · Just your chosen creators
        </p>
      </div>
    </div>
  );
}
