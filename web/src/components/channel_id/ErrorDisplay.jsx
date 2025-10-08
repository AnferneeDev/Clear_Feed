'use client';

import Link from 'next/link';

// This component is shown when the API call fails.
export default function ErrorDisplay({ message }) {
  return (
    <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-xl font-bold text-red-700">Something went wrong</h3>
      <p className="text-red-600 mt-2">{message}</p>
      <Link
        href="/"
        className="mt-4 inline-block bg-[var(--primarius)] text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Go Back Home
      </Link>
    </div>
  );
}
