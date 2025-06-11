
import { ProtectedHeader } from "@/components/custom/navigation-bar-protect";

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
    <div>
       <ProtectedHeader user={user} />
      {children}
    </div>
  );
}
