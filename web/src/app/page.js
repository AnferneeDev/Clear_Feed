'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Import the new, smaller components
import {
  Header,
  Hero,
  Features,
  Testimonials,
  Footer,
} from '@/components/landing_page';

export default function Home() {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    // --- THE FIX: Use the 'channelUrl' state variable ---
    const searchInput = channelUrl.trim();

    if (!searchInput) {
      setError('Please enter a YouTube channel URL or @handle.');
      return;
    }

    // This is a good place to set loading state for the page transition
    setIsLoading(true);
    setError('');

    router.push(`/channel/${encodeURIComponent(searchInput)}`);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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

  return (
    <div className="bg-[var(--neuter)] text-[var(--secundarius)] min-h-screen flex flex-col scroll-smooth w-full">
      <Header scrollToSection={scrollToSection} />
      <main className="flex-grow">
        <Hero
          handleSearch={handleSearch}
          channelUrl={channelUrl}
          setChannelUrl={setChannelUrl}
          isLoading={isLoading}
          error={error}
        />
        <Features />
        <Testimonials testimonials={testimonials} />
      </main>
      <Footer />
    </div>
  );
}
