'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import { RainbowButton } from '../magicui/rainbow-button';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    router.push(`/channel/${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <RainbowButton href="/feed">My feed</RainbowButton>
      <div className="flex-1 flex justify-center px-4">
        {/* --- UPDATED: Added a submit button to the form --- */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-lg relative flex items-center"
        >
          <Input
            type="search"
            placeholder="Paste a YouTube channel URL or @handle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Added pr-10 to make space for the button on the right
            className="w-full rounded-full bg-secondary pl-10 pr-12 h-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

          {/* This button triggers the onSubmit when Enter is pressed */}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 h-8 w-8 rounded-full"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
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
