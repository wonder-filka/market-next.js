"use client";

import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { LangToggle } from "./toggle-language";
import { MenuIcon } from "../images/MenuIcon";
import { sidebarItemsAdmin } from "@/lib/constants";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/locales/client";
import { Button } from "../ui/button";

export function AdminHeader() {
   const [pending, startTransition] = useTransition()
    const t = useI18n();
    async function logout() {
        startTransition(async () => {
            await deleteSession()
            redirect('/login')
        })
    }
  return (
  <header className="flex min-w-[80vw] justify-between items-center p-2 border-b">
      <Sheet >
        <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>2TradeIn</SheetTitle>
            <div className="grid gap-4 p-4">
              {sidebarItemsAdmin.map((item) => {
                return (
                  <Link key={item.key} href={item.url}>{t(item.key as keyof typeof t)}</Link>
                )
              })}

            </div>
          </SheetHeader>
          <SheetFooter>
            <LangToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <SidebarTrigger className="hidden md:flex" />
      {/* Logo */}
      <Link href="/" className="flex md:hidden font-bold text-xl items-center">2TradeIn</Link>
      {/* Main nav */}
      {/* User & Lang */}
      <div className="flex gap-4 items-center">
        <LangToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                АА
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Админ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button type="submit" variant="ghost" disabled={pending} className="w-full" onClick={logout}>{t('logout')}</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}