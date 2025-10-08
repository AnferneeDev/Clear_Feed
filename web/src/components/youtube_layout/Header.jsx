'use client';

import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

// This is the top header, now including the SidebarTrigger
// --- UPDATED: Changed to a named export ---
export default function Header() {
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search submitted');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <SidebarTrigger className="md:hidden" />

      <div className="flex-1 flex justify-center px-4">
        <form onSubmit={handleSearch} className="w-full max-w-lg relative">
          <Input
            type="search"
            placeholder="Search for a new channel..."
            className="w-full rounded-full bg-secundarius pl-10 h-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
