'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { RainbowButton } from '../magicui/rainbow-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // --- ADDED: State to manage the loading animation ---
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Turn off loading animation when page navigation completes
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    // --- ADDED: Turn on loading animation on submit ---
    setIsLoading(true);
    router.push(`/channel/${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <RainbowButton>
        <Link href="/feed">My feed</Link>
      </RainbowButton>

      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-lg relative">
          {/* --- UPDATED: Gradient border wrapper with animation classes --- */}
          <div
            className={cn(
              'relative rounded-full bg-gradient-to-r from-[var(--primarius)] via-purple-500 to-red-500 p-[1px] transition-all duration-300',
              // These classes create the ::before pseudo-element for the animation
              'before:absolute before:inset-0 before:rounded-full before:bg-[var(--primarius)] before:w-0 before:transition-all before:duration-1000',
              // When isLoading is true, this class animates the width to 100%
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
                className="py-6 text-base rounded-full sm:flex-grow h-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-4"
              />
            </form>
          </div>

          <button
            form="search-form"
            type="submit"
            aria-label="Search"
            disabled={isLoading} // --- ADDED: Disable button while loading
            className="absolute right-[5px] top-1/2 -translate-y-1/2 h-8 w-10 rounded-full px-2 flex items-center justify-center z-10 bg-transparent border-none"
          >
            {/* --- ADDED: Show a spinner when loading --- */}
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <AnimatedThemeToggler />
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  );
}
