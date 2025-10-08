'use client';

import Header from './Header';
import Sidebar from './Sidebar';

// This component orchestrates the entire YouTube-like layout
export default function AppLayout({ children, channelData }) {
  return (
    <div className="flex flex-col h-screen bg-[var(--neuter)] text-[var(--secundarius)]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar channelData={channelData} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
