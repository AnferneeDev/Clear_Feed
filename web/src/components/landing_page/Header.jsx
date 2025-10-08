'use client';

import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function Header({ scrollToSection }) {
  return (
    <header className="sticky top-0 bg-[var(--neuter)]/90 backdrop-blur z-20 border-b border-white/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Image
            src="/clear_feed.png"
            alt="Clear Feed logo"
            width={50}
            height={50}
          />
          <span className="text-2xl font-bold">Clear Feed</span>
        </div>

        {/* Navigation & Authentication */}
        <nav className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => scrollToSection('features')}>
            Features
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('testimonials')}
          >
            Testimonials
          </Button>

          {/* --- CLERK AUTHENTICATION LOGIC --- */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Create Feed</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
