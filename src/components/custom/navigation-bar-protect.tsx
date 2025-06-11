"use client";

import Link from "next/link";
import { useI18n } from "@/locales/client";
import { LangToggle } from "./toggle-language";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "../images/MenuIcon";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { useTransition } from "react";


type User = {
  name: string;
  email?: string;
  avatarUrl?: string;
};


export function ProtectedHeader({ user }: { user: User }) {
  const t = useI18n();
  const [pending, startTransition] = useTransition()

  async function logout() {
    startTransition(async () => {
      await deleteSession()
      redirect('/login')
    })
  }
  return (
    <header className="flex min-w-screen justify-between items-center p-4 border-b">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>2TradeIn</SheetTitle>
            <div className="grid gap-4 p-4">
              <Link href="/dashboard">{t('dashboard')}</Link>
              <Link href="/services">{t('services')}</Link>
              <Link href="/education">{t('education')}</Link>
              <Link href="/news">{t('news')}</Link>
              <Link href="/about">{t('about')}</Link>
              <Link href="/reviews">{t('reviews')}</Link>
              <Link href="/contacts">{t('contacts')}</Link>
              <Link href="/faq">{t('faq')}</Link>
            </div>
          </SheetHeader>
          <SheetFooter>
            <LangToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Link href="/" className="hidden md:flex font-bold text-xl items-center">2TradeIn</Link>
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/dashboard">{t('dashboard')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/services">{t('services')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/education">{t('education')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/news">{t('news')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/about">{t('about')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/reviews">{t('reviews')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contacts">{t('contacts')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/faq">{t('faq')}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* User & Lang */}
      <div className="flex gap-4 items-center">
        <LangToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border border-gray-200 dark:border-gray-600">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.name}
              {user.email && (
                <div className="text-xs text-muted-foreground">{user.email}</div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">{t('profile')}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">{t('dashboard')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                type="submit"
                className="w-full text-left"
                onClick={logout}
                disabled={pending}
              >
                {t('logout')}
              </Button>

            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
