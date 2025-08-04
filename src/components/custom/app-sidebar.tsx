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
import { LogOut } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/locales/client"
import { useTransition } from "react"
import { deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sidebarItems } from "@/lib/constants"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar> ) {
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
            <SidebarMenuButton 
           >
              <Link href="/"  hidden={state !== "collapsed"}>
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
          <SidebarMenu >
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.key} >
                <SidebarMenuButton asChild 
             >
                  <Link href={item.url} >
                    <item.icon />
                    <span className="">{t(item.key as keyof typeof t)}</span>
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
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={logout} disabled={pending}  >
              <Link href="#" className="">
                <LogOut />
                <span className="">{t('sidebar.logout')}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
