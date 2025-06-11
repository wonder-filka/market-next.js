"use client";

import Link from "next/link";
import { useI18n } from "@/locales/client";
import { LangToggle } from "./toggle-language";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu"; import { MenuIcon } from "../images/MenuIcon";
;

export function UnprotectedHeader() {
  const t = useI18n();
  return (
    <header className="flex min-w-screen justify-between items-center p-4">
      <Sheet>
        <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>2TradeIn</SheetTitle>
            <div className="grid gap-4 p-4">
              <Link href="/">{t('home')}</Link>
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
      <div className="absolute left-1/2  -translate-x-1/2" >
        <NavigationMenu className="hidden md:flex flex-grow">
          <NavigationMenuList className="flex flex-wrap justify-center">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/">{t('home')}</Link>
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

      </div>
      {/* Lang + Auth */}
      <div className="flex gap-2 items-center">
        <LangToggle />
        <Button asChild variant="outline">
          <Link href="/registration">{t('register')}</Link>
        </Button>
        <Button asChild variant="default">
          <Link href="/login">{t('login')}</Link>
        </Button>
      </div>
    </header>
  );
}