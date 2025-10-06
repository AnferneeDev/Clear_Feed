'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="bg-[#FEFBFB] text-[#413C3C]">
      {/* Navbar */}
      <header className="absolute top-0 left-0 w-full z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2C2828]">Clear Feed</h1>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2C2828] leading-tight">
              Focus on creators, <br /> not the algorithm.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-[#655D5D]">
              Reclaim your attention. Clear Feed strips away the clickbait,
              recommendations, and distractions, giving you a clean, focused
              feed of only the channels you choose.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
            >
              <input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="Paste a YouTube channel URL or @handle"
                className="w-full sm:flex-grow px-4 py-3 text-[#413C3C] bg-transparent border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#E1A0B5]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-[#D489A3] text-white font-semibold rounded-md shadow-md hover:bg-[#C2788E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D489A3] transition-colors disabled:bg-[#E1A0B5] disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Create Your Focused Feed'
                )}
              </button>
            </form>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2828]">
                Built for viewers who value their time.
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-[#FEFBFB] p-6 rounded-lg border border-gray-200"
                >
                  <p className="text-[#413C3C] text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4">
                    <p className="font-bold text-[#2C2828]">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-[#857C7C]">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features -> Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#2C2828]">
                  Distraction-Free UI
                </h3>
                <p className="mt-2 text-[#655D5D]">
                  <span className="font-semibold text-[#D489A3]">Benefit:</span>{' '}
                  Enjoy a calm, minimalist interface that puts the content you
                  chose front and center.
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#2C2828]">
                  Chronological Feed
                </h3>
                <p className="mt-2 text-[#655D5D]">
                  <span className="font-semibold text-[#D489A3]">Benefit:</span>{' '}
                  You decide what's important, not an algorithm designed to
                  maximize your watch time.
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-[#2C2828]">
                  No Tracking
                </h3>
                <p className="mt-2 text-[#655D5D]">
                  <span className="font-semibold text-[#D489A3]">Benefit:</span>{' '}
                  Your viewing habits are your business. We have no reason to
                  track what you watch.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2828] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Clear Feed. All Rights Reserved.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Built for those who value their focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
