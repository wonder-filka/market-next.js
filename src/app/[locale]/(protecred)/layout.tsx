

import { AppSidebar } from "@/components/custom/app-sidebar";
import { ProtectedHeader } from "@/components/custom/navigation-bar-protect";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const user = {
  name: "Ирина",
  email: "iryna@example.com",
  avatarUrl: "https://i.pravatar.cc/150?img=10"
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
   
      <AppSidebar className="hidden md:flex" />
      <SidebarInset>
           <ProtectedHeader user={user} />
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
