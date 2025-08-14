

import { AppSidebarAdmin } from "@/components/custom/app-sidebar-admin";
import { AdminHeader } from "@/components/custom/navigation-bar-admin";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSessionUserId } from "@/lib/session";



export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await getSessionUserId()
  if (!userId) return

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebarAdmin className="hidden md:flex" />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
