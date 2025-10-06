'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

// --- Import Shadcn/ui Components ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function LandingPage() {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!channelUrl) {
      setError('Please enter a YouTube channel URL or @handle.');
      return;
    }
    setError('');
    setIsLoading(true);

    const match = channelUrl.match(/(?:@|c\/|channel\/)([^/]+)/);
    const id = match ? match[1] : channelUrl;
    const finalId = id.startsWith('@') ? id : `@${id}`;

    router.push(`/channel/${encodeURIComponent(finalId)}`);
  };

  const testimonials = [
    {
      quote:
        'I used to fall down the recommendation rabbit hole while studying. Clear Feed gives me exactly what I need and nothing else.',
      name: 'Alex',
      title: 'University Student',
    },
    {
      quote:
        '20 minutes a day to catch up on my industry — Clear Feed makes that possible without the clickbait.',
      name: 'Maria',
      title: 'Senior Developer',
    },
    {
      quote:
        'Taking back control from the algorithm changed how I work. No autoplay, no tracking, just creators I choose.',
      name: 'James',
      title: 'Digital Artist',
    },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[var(--neuter)] text-[var(--secundarius)] min-h-screen flex flex-col scroll-smooth">
      {/* Navbar */}
      <header className="sticky top-0 bg-[var(--neuter)]/90 backdrop-blur z-20 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image
              src="/logo.png"
              alt="Clear Feed logo"
              width={90}
              height={90}
            />
            <span className="text-2xl font-bold">Clear Feed</span>
          </div>

          {/* Navigation */}
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
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button size="sm">Create Feed</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="flex flex-col items-center justify-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Stop the algorithm. <br /> Watch only what matters.
          </h1>
          <p className="mt-4 text-lg md:text-xl opacity-80 max-w-xl">
            Reclaim your attention — Clear Feed removes autoplay, clickbait, and
            distractions. Build your own focused YouTube feed, powered by your
            choices, not the algorithm.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-xl"
          >
            <Input
              type="text"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              placeholder="Paste a YouTube channel URL or @handle"
              className="py-4 text-base sm:flex-grow"
            />
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating feed...
                </>
              ) : (
                'Create Focused Feed'
              )}
            </Button>
          </form>

          {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
          <p className="mt-3 text-sm opacity-70">
            No autoplay · No recommendations · Just your chosen creators
          </p>
        </div>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 w-full bg-white/40 mt-24 scroll-mt-24"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold">
              Features that protect your attention
            </h2>
            <p className="mt-2 max-w-2xl mx-auto opacity-80">
              Clear Feed helps you reclaim your time by focusing only on
              creators you actually want to see.
            </p>

            <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-xl">🎯 Distraction-Free UI</h3>
                <p className="mt-2 opacity-80">
                  A minimalist layout that keeps videos and creators front and
                  center.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl">🕒 Chronological Feed</h3>
                <p className="mt-2 opacity-80">
                  No recommendations — just the latest uploads from your chosen
                  channels.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl">🛡 Privacy First</h3>
                <p className="mt-2 opacity-80">
                  No tracking or data collection — your attention stays yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-24 w-full bg-white/60 scroll-mt-24"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Built for viewers who value their time
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <Card key={i} className="bg-[var(--neuter)]">
                  <CardContent className="pt-6">
                    <p className="text-lg">"{t.quote}"</p>
                  </CardContent>
                  <CardFooter>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm opacity-70">{t.title}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--secundarius)] text-[var(--neuter)] py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Clear Feed. All Rights Reserved.
          </p>
          <p className="text-sm opacity-70 mt-2">
            Built for people who value their focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
