"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu"; 

export function AdminHeader() {

  return (
    <header className="flex min-w-screen justify-center items-center p-4">
        <NavigationMenu className="flex-grow">
          <NavigationMenuList className="flex flex-wrap justify-center">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/admin">Сделки</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/chat">Чаты</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
  
    </header>
  );
}