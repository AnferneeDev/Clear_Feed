'use client';

import Sidebar from './AppSidebar'; // CORRECTED
import { SidebarInset } from '@/components/ui/sidebar';
import Header from './Header';
import Image from 'next/image';

export default function AppLayout({ children, channelData }) {
  return (
    <>
      <Sidebar channelData={channelData} /> {/* CORRECTED */}
      <SidebarInset>
        <Header />

        {channelData?.channelInfo?.banner && (
          <div className="relative h-32 md:h-48 w-full">
            <Image
              src={channelData.channelInfo.banner}
              alt={`${channelData.channelInfo.title} banner`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-2">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
