

import { AppSidebar } from "@/components/custom/app-sidebar";
import { ProtectedHeader } from "@/components/custom/navigation-bar-protect";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSessionUserId } from "@/lib/session";
import { getUserBasicSettings } from "./settings/_actions";
import { AppSidebarAdmin } from "@/components/custom/app-sidebar-admin";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId()
  if (!userId) return
  const userBasicSettings = await getUserBasicSettings(userId)
  if (!userBasicSettings) return
  	 const adminId = process.env.ADMIN_ID;
  return (
    <SidebarProvider defaultOpen={true}>
      {
        userId !== adminId ? <AppSidebar className="hidden md:flex" />
          : <AppSidebarAdmin className="hidden md:flex" userId={userId} />
      }

      <SidebarInset>
        <ProtectedHeader data={userBasicSettings} />
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
