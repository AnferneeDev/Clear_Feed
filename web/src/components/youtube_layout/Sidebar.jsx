'use client';

import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail, // The collapse trigger for desktop
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
import Link from 'next/link';

// This is the left sidebar, rebuilt with the new shadcn/ui sidebar components
export default function AppSidebar({ channelData }) {
  // For now, it just shows the currently viewed channel as a placeholder
  const channels = channelData ? [channelData.channelInfo] : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarRail /> {/* <-- This adds the collapse trigger rail */}
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/clear_feed.png"
            alt="Clear Feed logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Clear Feed</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home" isActive>
              <Home className="size-4" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        {/* Following section is now part of the main content flow */}
        <div className="flex flex-col gap-2 p-2">
          <h2 className="px-2 text-xs font-medium text-sidebar-foreground/70">
            Following ({channels.length}/5) {/* <-- Updated count */}
          </h2>
          <SidebarMenu>
            {channels.map((channel) => (
              <SidebarMenuItem key={channel.title}>
                <SidebarMenuButton tooltip={channel.title}>
                  <Image
                    src={channel.thumbnail}
                    alt={channel.title}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span>{channel.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
