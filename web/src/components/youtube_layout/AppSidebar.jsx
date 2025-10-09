// components/youtube_layout/Sidebar.jsx
'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser, SignedIn } from '@clerk/nextjs';
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';

export default function AppSidebar() {
  const { user } = useUser();
  const [channelHistory, setChannelHistory] = useState([]);

  // Update local state whenever user data changes
  useEffect(() => {
    if (user?.publicMetadata?.channelHistory) {
      console.log(
        '🔄 Sidebar updating with new history:',
        user.publicMetadata.channelHistory
      );
      setChannelHistory(user.publicMetadata.channelHistory);
    }
  }, [user?.publicMetadata?.channelHistory]);

  console.log('🎨 Sidebar render - History length:', channelHistory.length);

  // Debug logging
  console.log('=== SIDEBAR DEBUG ===');
  console.log('User:', user?.id);
  console.log('Public Metadata:', user?.publicMetadata);
  console.log('Channel History:', channelHistory);
  console.log('History Length:', channelHistory.length);

  return (
    <Sidebar collapsible="icon" className="overflow-x-hidden">
      <SidebarRail />
      <SidebarContent className="overflow-x-hidden">
        {/* Logo and Trigger */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2">
                  <SidebarTrigger className={'w-10 h-10'} />
                  <SidebarMenuButton asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        src="/clear_feed.png"
                        alt="Clear Feed logo"
                        width={32}
                        height={32}
                        className="flex-shrink-0"
                      />
                      <span className="text-xl font-bold data-[state=collapsed]:hidden truncate">
                        Clear Feed
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent History Section */}
        <SignedIn>
          {channelHistory.length > 0 ? (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="data-[state=collapsed]:hidden">
                  Recent
                </SidebarGroupLabel>
                <SidebarGroupContent className={'mr-8'}>
                  <SidebarMenu>
                    {channelHistory.map((channel) => {
                      console.log('Rendering channel:', channel);
                      return (
                        <SidebarMenuItem key={channel.id}>
                          <SidebarMenuButton asChild tooltip={channel.title}>
                            <Link
                              href={`/channel/${channel.id}`}
                              className="w-full"
                            >
                              <div className="flex items-center justify-center">
                                <Image
                                  src={channel.thumbnail}
                                  alt={channel.title}
                                  width={32}
                                  height={32}
                                  className="rounded-full flex-shrink-0"
                                />
                              </div>
                              <span className="data-[state=collapsed]:hidden truncate">
                                {channel.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : (
            // Debug: Show when history is empty
            <div className="p-4 text-sm text-muted-foreground">
              No recent channels
            </div>
          )}
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
}
