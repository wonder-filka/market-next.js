"use client";

import Link from "next/link";
import { useI18n } from "@/locales/client";
import { LangToggle } from "./toggle-language";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";
import { useTransition } from "react";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";



function MenuIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

export function ProtectedHeader({ user }: { user: { name: string, avatarUrl?: string } }) {
    const t = useI18n();
    const [pending, startTransition] = useTransition()

    async function logout() {
        startTransition(async () => {
            await deleteSession()
            redirect('/login')
        })
    }
    return (
        <header className="flex min-w-[80vw] justify-between items-center p-2 border-b">
            {/* Mobile menu */}
            <Sheet >
                <SheetTrigger className="md:hidden"><MenuIcon /></SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>2TradeIn</SheetTitle>
                        <div className="grid gap-4 p-4">
                            {sidebarItems.map((item) => {
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
                            {user.avatarUrl ? (
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                            ) : (
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            )}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">{t('profile')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">{t('dashboard')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>

                            <button type="submit" className="w-full text-left" onClick={logout}>{t('logout')}</button>

                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
