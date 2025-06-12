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
} from "@/components/ui/sidebar"
import { Home, BarChart, Wallet, Settings, LogOut, Send } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/locales/client"
import { useTransition } from "react"
import { deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"

const items = [
  {
    key: "sidebar.quotes",
    url: "/quotes",
    icon: BarChart,
  },
  {
    key: "sidebar.accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    key: "sidebar.portfolio",
    url: "/portfolio",
    icon: Home,
  },
  {
    key: "sidebar.settings",
    url: "/settings",
    icon: Settings,
  },

]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useI18n();
  const [pending, startTransition] = useTransition()

  async function logout() {
    startTransition(async () => {
      await deleteSession()
      redirect('/')
    })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5" >
              <Link href="/">
                <span className="text-base font-semibold"> 2TradeIn</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.key} >
              <SidebarMenuButton asChild >
                <Link href={item.url} >
                  <item.icon size={20} />
                  <span>{t(item.key as keyof typeof t)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild >
              <Link href="/support" >
                <Send size={20} />
                <span>{t('sidebar.support')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={logout} disabled={pending}>
              <Link href="#" className="">
                <LogOut size={20} />
                <span>{t('sidebar.logout')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
