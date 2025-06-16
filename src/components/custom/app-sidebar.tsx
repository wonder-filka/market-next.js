'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, BarChart, Wallet, Settings, LogOut, Send, FileCheck } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/locales/client"
import { useTransition } from "react"
import { deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sidebarItems } from "@/lib/constants"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n();
  const [pending, startTransition] = useTransition()

  async function logout() {
    startTransition(async () => {
      await deleteSession()
      redirect('/')
    })
  }
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foregroun group-data-[collapsible=icon]:mt-2">
              <Link href="/" className="text-2xl font-bold " hidden={state !== "collapsed"}>
                2T
              </Link>
              <div className="grid flex-1 text-left leading-tight ">
                <Link href="/" className="truncate text-2xl font-bold"> 2TradeIn</Link>
              </div>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col group-data-[collapsible=icon]:gap-4">
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.key} >
                <SidebarMenuButton asChild size="lg"
                  className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1">
                  <Link href={item.url} >
                    <item.icon />
                    <span className="text-xl">{t(item.key as keyof typeof t)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter hidden={false}>
        <SidebarMenu >
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1">
              <Link href="/support" >
                <Send />
                <span className="text-xl">{t('sidebar.support')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={logout} disabled={pending} size="lg" className="[&>svg]:size-6 group-data-[collapsible=icon]:[&>svg]:ml-1">
              <Link href="#" className="">
                <LogOut />
                <span className="text-xl">{t('sidebar.logout')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
