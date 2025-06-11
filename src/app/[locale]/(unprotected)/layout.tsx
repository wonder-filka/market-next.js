
import { UnprotectedHeader } from "@/components/custom/navigation-bar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UnprotectedHeader />
      {children}
    </div>
  );
}
