"use client";

import Link from "next/link";
import { useI18n } from "@/locales/client";
import { LangToggle } from "./toggle-language";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
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
    <header className="relative flex justify-between items-center p-4 w-full max-w-screen">
      <Sheet>
        <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
        <SheetContent  side="left">
          <SheetHeader>
            <SheetTitle>2TradeIn</SheetTitle>
            <div className="grid gap-4 p-4">
              <SheetClose asChild>
                <Link href="/">{t('home')}</Link>
              </SheetClose>
              <SheetClose asChild>

                <Link href="/services">{t('services')}</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/education">{t('education')}</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/news">{t('news')}</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/about">{t('about')}</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/faq">{t('faq')}</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/contacts">{t('contacts')}</Link>
              </SheetClose>




              {/* <Link href="/reviews">{t('reviews')}</Link> */}



            </div>
          </SheetHeader>
          <SheetFooter>
            <LangToggle />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Link href="/" className="hidden md:flex font-bold text-xl items-center">2TradeIn</Link>
      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
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
            {/* <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/reviews">{t('reviews')}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/faq">{t('faq')}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contacts">{t('contacts')}</Link>
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