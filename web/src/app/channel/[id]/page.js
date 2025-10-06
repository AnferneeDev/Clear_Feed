'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LandingPage() {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!channelUrl) {
      setError('Please enter a YouTube channel URL or handle.');
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
        'I used to fall down the recommendation rabbit hole while studying. Clear Feed gives me exactly what I need and nothing else. My focus has never been better.',
      name: 'Alex',
      title: 'University Student',
    },
    {
      quote:
        "I have 20 minutes a day to catch up on my industry. Clear Feed saves me from wasting a single second on clickbait. It's clean, fast, and respects my time.",
      name: 'Maria',
      title: 'Senior Developer',
    },
    {
      quote:
        'It feels incredible to take back control from the algorithm. This is what the internet should feel like—a tool that I control, not the other way around.',
      name: 'James',
      title: 'Digital Artist',
    },
  ];

  return (
    // Theming is now driven by your custom CSS variables.
    // You will need to define --neuter-bg, --neuter-text, etc. in your globals.css
    <div className="bg-[var(--neuter-bg)] text-[var(--neuter-text)]">
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--neuter-text-strong)]">
            Clear Feed
          </h1>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--neuter-text-strong)] leading-tight">
              Focus on creators, <br /> not the algorithm.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-[var(--neuter-text-muted)]">
              Reclaim your attention. Clear Feed strips away the clickbait,
              recommendations, and distractions, giving you a clean, focused
              feed of only the channels you choose.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2"
            >
              <Input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="Paste a YouTube channel URL or @handle"
                className="w-full sm:flex-grow py-6 text-base"
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Create Your Focused Feed'
                )}
              </Button>
            </form>
            {error && <p className="mt-2 text-destructive text-sm">{error}</p>}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-[var(--neuter-card-bg)]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--neuter-text-strong)]">
                Built for viewers who value their time.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-[var(--neuter-bg)]">
                  <CardContent className="pt-6">
                    <p className="text-[var(--neuter-text)] text-lg">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div>
                      <p className="font-bold text-[var(--neuter-text-strong)]">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-[var(--neuter-text-muted)]">
                        {testimonial.title}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features -> Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-xl text-[var(--neuter-text-strong)]">
                  Distraction-Free UI
                </h3>
                <p className="mt-2 text-[var(--neuter-text-muted)]">
                  <span className="font-semibold text-[var(--primarius)]">
                    Benefit:
                  </span>{' '}
                  Enjoy a calm, minimalist interface that puts the content you
                  chose front and center.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-[var(--neuter-text-strong)]">
                  Chronological Feed
                </h3>
                <p className="mt-2 text-[var(--neuter-text-muted)]">
                  <span className="font-semibold text-[var(--primarius)]">
                    Benefit:
                  </span>{' '}
                  You decide what's important, not an algorithm designed to
                  maximize watch time.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-[var(--neuter-text-strong)]">
                  No Tracking
                </h3>
                <p className="mt-2 text-[var(--neuter-text-muted)]">
                  <span className="font-semibold text-[var(--primarius)]">
                    Benefit:
                  </span>{' '}
                  Your viewing habits are your business. We have no reason to
                  track what you watch.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--neuter-dark)] text-[var(--neuter-bg)] py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Clear Feed. All Rights Reserved.
          </p>
          <p className="text-sm text-[var(--neuter-text-muted)] mt-2">
            Built for those who value their focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
