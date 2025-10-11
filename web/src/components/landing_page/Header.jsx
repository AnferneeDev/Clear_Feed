'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';

export default function Header({ scrollToSection }) {
  return (
    <header className="sticky top-0 bg-[var(--neuter)]/90 backdrop-blur z-20 border-b border-white/20">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="rounded-full bg-white">
            <Image
              src="/clear_feed.png"
              alt="Clear Feed logo"
              width={40}
              height={40}
            />
          </div>
          <span className="text-xl font-bold">Clear Feed</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={() => scrollToSection('features')}>
            Features
          </Button>
          <Button
            variant="ghost"
            onClick={() => scrollToSection('testimonials')}
          >
            Testimonials
          </Button>
          <AnimatedThemeToggler />
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" className={'text-foreground'}>
                Sing in
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <AnimatedThemeToggler />

          <SignedOut>
            {/* --- UPDATED: Grouped both buttons for mobile --- */}
            <div className="flex items-center gap-1">
              <SignInButton mode="modal">
                <Button size="sm" className={'text-foreground'}>
                  Sing in
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
