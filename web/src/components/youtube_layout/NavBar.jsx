'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Rss } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { ShinyButton } from '../magicui';
import { cn } from '@/lib/utils';
import { SupportButton } from './SupportButton';

export default function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    router.push(`/channel/${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center border-b bg-background/95 px-2 sm:px-4 backdrop-blur">
      {/* LEFT: 20% of the navbar; content centered */}
      <div className="basis-[20%] flex items-center justify-center">
        <div className="flex items-center justify-center">
          {/* keep SidebarTrigger here but hidden on md+ (same as before) */}
          <SidebarTrigger className="md:hidden mr-2" />
          {pathname !== '/feed' && (
            <ShinyButton
              className="px-2 md:px-6 bg-[var(--primarius)] text-foreground min-w-[60px] whitespace-nowrap"
              onClick={() => router.push('/feed')}
            >
              <div className="flex items-center gap-2">
                <Rss className="h-5 w-5 flex-shrink-0" />
                <span className="font-bold hidden md:inline">Feed</span>
                <span className="sr-only">Feed</span>
              </div>
            </ShinyButton>
          )}
        </div>
      </div>

      {/* CENTER: 60% of navbar (search occupies this area) */}
      <div className="basis-[60%] flex items-center justify-center px-4">
        <div className="w-full max-w-full min-w-0">
          <div
            className={cn(
              'relative rounded-full bg-gradient-to-r from-[var(--primarius)] via-purple-500 to-red-500 p-[1px] transition-all duration-300',
              'before:absolute before:inset-0 before:rounded-full before:bg-[var(--primarius)] before:w-0 before:transition-all before:duration-1000',
              isLoading && 'before:w-full'
            )}
          >
            <form
              id="search-form"
              onSubmit={handleSearch}
              className="relative flex items-center w-full rounded-full bg-background h-10"
            >
              <Input
                type="text"
                placeholder="Paste a YouTube channel URL, video URL, or @handle"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-6 text-base rounded-full bg-transparent border-none sm:ml-2 sm:flex-grow h-12 focus-visible:ring-0 focus-visible:ring-offset-0 pl-4 pr-8 truncate min-w-0"
              />
            </form>
          </div>

          <button
            form="search-form"
            type="submit"
            aria-label="Search"
            disabled={isLoading}
            className="absolute right-[5px] top-1/2 -translate-y-1/2 h-8 w-10 rounded-full px-2 flex items-center justify-center z-10 bg-transparent border-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-5 w-6 text-muted-foreground" />
            )}
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>

      {/* RIGHT: 20% of the navbar; contents centered and won't wrap */}
      <div className="basis-[20%] flex items-center justify-center gap-2 flex-nowrap">
        <div className="flex items-center justify-center gap-2 flex-nowrap">
          <SupportButton />

          <div className="hidden md:flex">
            <AnimatedThemeToggler />
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
