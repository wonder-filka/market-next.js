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
import { Folder, LogOut, MessageCircle, Wallet } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/locales/client"
import { useTransition } from "react"
import { deleteSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sidebarItemsAdmin } from "@/lib/constants"

export function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
            {sidebarItemsAdmin.map((item) => (
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
            <SidebarSeparator />
             <SidebarMenuItem >
                <SidebarMenuButton asChild 
             >
                  <Link href="/admin" >
                    <Folder />
                    <span className="">{t("admin")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem >
                <SidebarMenuButton asChild 
             >
                  <Link href="/chat" >
                    <MessageCircle />
                    <span className="">{t("chat")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem >
                <SidebarMenuButton asChild 
             >
                  <Link href="/wallets_ad" >
                    <Wallet />
                    <span className="">Кошельки</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                    <SidebarMenuItem >
                <SidebarMenuButton asChild 
             >
                  <Link href="/verification" >
                    <Wallet />
                    <span className="">Верификация</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem >
                <SidebarMenuButton asChild 
             >
                  <Link href="/crypto_wallets" >
                    <Wallet />
                    <span className="">Crypto Кошельки</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter hidden={false}>
        <SidebarMenu >
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
