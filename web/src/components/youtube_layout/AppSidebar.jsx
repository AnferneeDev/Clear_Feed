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
    <Sidebar collapsible="icon" className="overflow-x-hidden bg-background">
      <SidebarRail />
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center gap-2">
                  {/* --- SidebarTrigger with hamburger icon --- */}
                  <SidebarTrigger className="w-11 h-11 flex items-center justify-center"></SidebarTrigger>

                  <SidebarMenuButton asChild>
                    <Link href="/feed" className="flex items-center gap-2">
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
          {/* --- CHANGE 2: Added a separator --- */}
          <SidebarSeparator />

          {/* --- CHANGE 4: Added a new, empty "Following" group --- */}
          <SidebarGroup>
            <SidebarGroupLabel className="data-[state=collapsed]:hidden">
              Following
            </SidebarGroupLabel>
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup>

          {/* "Recent" History Group */}
          {channelHistory.length > 0 && (
            <>
              {/* --- CHANGE 5: Added a separator --- */}
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
