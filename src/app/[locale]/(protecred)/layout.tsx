

import { AppSidebar } from "@/components/custom/app-sidebar";
import { ProtectedHeader } from "@/components/custom/navigation-bar-protect";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSessionUserId } from "@/lib/session";
import { getUserBasicSettings } from "./settings/_actions";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId()
  if (!userId) return
  const userBasicSettings = await getUserBasicSettings(userId)
  if (!userBasicSettings) return
  return (
    <SidebarProvider defaultOpen={true}>

      <AppSidebar className="hidden md:flex" />
      <SidebarInset>
        <ProtectedHeader data={userBasicSettings} />
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
