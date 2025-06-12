

import { AppSidebar } from "@/components/custom/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
