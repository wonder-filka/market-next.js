"use client";

import Link from "next/link";
import { useI18n } from "@/locales/client";
import { LangToggle } from "./toggle-language";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { sidebarItems } from "@/lib/constants";
import { SidebarTrigger } from "../ui/sidebar";
import { useTransition } from "react";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { UpdateUserBasicSettingsInput } from "@/lib/types";
import { Button } from "../ui/button";
import { SupportComponent } from "./support-component";

function MenuIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

interface UserBasicSettingsProps {
    data: UpdateUserBasicSettingsInput
    userId: string
}

export function ProtectedHeader({ data, userId }: UserBasicSettingsProps) {
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
                                    <SheetClose key={item.key} asChild className="text-start">
                                        <Link key={item.key} href={item.url}>{t(item.key as keyof typeof t)}</Link>
                                    </SheetClose>
                                )
                            })}

                        </div>
                    </SheetHeader>
                    <SheetFooter>
                        <SheetClose asChild className="text-start">
                            {userId &&
                                <SupportComponent
                                    userId={userId}
                                    firstName={data.firstName}
                                    lastName={data.lastName}
                                    email={data.email}
                                    phone={data.phone}

                                />}
                        </SheetClose>

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
                                {(data.firstName?.[0] || "").toUpperCase()}
                                {(data.lastName?.[0] || "").toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{data.firstName} {data.lastName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/accounts">{t('sidebar.accounts')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">{t('sidebar.settings')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Button type="submit" variant="ghost" disabled={pending} className="w-full text-start" onClick={logout}>{t('logout')}</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
