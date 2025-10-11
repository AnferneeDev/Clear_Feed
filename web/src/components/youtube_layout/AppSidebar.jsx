'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUser, SignedIn } from '@clerk/nextjs';
import { getChannelHistory } from '@/lib/user.service';
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
import { Rss } from 'lucide-react';

export default function AppSidebar() {
  const { user } = useUser();
  const channelHistory = getChannelHistory(user);
  const followedChannels = user?.publicMetadata?.followedChannels || [];

  return (
    <Sidebar collapsible="icon" className="overflow-x-hidden bg-background">
      <SidebarRail />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="w-11 h-11 flex items-center justify-center group-data-[collapsible=icon]:-ml-1.5"></SidebarTrigger>
                  <SidebarMenuButton asChild>
                    <Link href="/" className="flex items-center gap-2">
                      <div className="rounded-full bg-white">
                        <Image
                          src="/clear_feed.png"
                          alt="Clear Feed logo"
                          width={32}
                          height={32}
                          className="flex-shrink-0"
                        />
                      </div>
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

        <SignedIn>
          <SidebarGroup>
            <SidebarGroupLabel className="data-[state=collapsed]:hidden">
              Following ({followedChannels.length}/5)
            </SidebarGroupLabel>
            <SidebarGroupContent className={'mr-8'}>
              <SidebarMenu>
                {followedChannels.length > 0 ? (
                  followedChannels.map((channel) => (
                    <SidebarMenuItem key={channel.id}>
                      <SidebarMenuButton asChild tooltip={channel.title}>
                        <Link
                          href={`/channel/${channel.handle || channel.id}`}
                          className="w-full"
                        >
                          <div className="flex items-center justify-center group-data-[collapsible=icon]:-ml-2">
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
                  ))
                ) : (
                  <span className="px-4 py-2 text-xs text-muted-foreground data-[state=collapsed]:hidden">
                    Follow channels to see them here.
                  </span>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {channelHistory.length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="data-[state=collapsed]:hidden">
                  Recent
                </SidebarGroupLabel>
                <SidebarGroupContent className={'mr-8'}>
                  <SidebarMenu>
                    {channelHistory.map((channel) => (
                      <SidebarMenuItem key={channel.id}>
                        <SidebarMenuButton asChild tooltip={channel.title}>
                          <Link
                            href={`/channel/${channel.id}`}
                            className="w-full"
                          >
                            <div className="flex items-center justify-center group-data-[collapsible=icon]:-ml-2">
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
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
}
