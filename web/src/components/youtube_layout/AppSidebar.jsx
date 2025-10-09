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

export default function AppSidebar() {
  const { user } = useUser();
  const channelHistory = getChannelHistory(user);

  return (
    <Sidebar collapsible="icon" className="overflow-x-hidden">
      <SidebarRail />
      <SidebarContent className="overflow-x-hidden">
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

        <SignedIn>
          {channelHistory.length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="data-[state=collapsed]:hidden">
                  My feed
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/feed" className="w-full">
                          <span className="data-[state=collapsed]:hidden truncate">
                            Feed
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
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
