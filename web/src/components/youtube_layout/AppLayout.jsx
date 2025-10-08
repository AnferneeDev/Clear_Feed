'use client';

import AppSidebar from './Sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from './Header'; // <-- UPDATED: Changed to a named import

// This component now orchestrates the layout using the shadcn sidebar pattern
export default function AppLayout({ children, channelData }) {
  return (
    <>
      <AppSidebar channelData={channelData} />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
    </>
  );
}
