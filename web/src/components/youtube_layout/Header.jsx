'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// This is the top header with the logo, search bar, and user profile
export default function Header() {
  // In the future, this would handle the search logic
  const handleSearch = (e) => {
    e.preventDefault();
    // Placeholder for search functionality
    console.log('Search submitted');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-[var(--neuter)]/95 px-4 backdrop-blur sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/clear_feed.png"
          alt="Clear Feed logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold hidden sm:inline-block">
          Clear Feed
        </span>
      </Link>

      <div className="flex-1 flex justify-center px-4">
        <form onSubmit={handleSearch} className="w-full max-w-lg relative">
          <Input
            type="search"
            placeholder="Search for a new channel..."
            className="w-full rounded-full bg-white/80 pl-10 h-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </form>
      </div>

      <div className="flex items-center gap-4">
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
