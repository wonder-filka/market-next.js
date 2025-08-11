// app/admin/verification/page.tsx
import { getSessionUserId } from "@/lib/session";
import { getUser } from "../(protecred)/accounts/_actions";

// клиентский компонент
import { getUsersForVerificationAdminAll } from "./_actions";
import VerificationTable from "./_components/verification-table";

export default async function Page() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if ("message" in user) return null;

  const adminId = process.env.ADMIN_ID;
  if (user.id !== adminId) return null;

  const res = await getUsersForVerificationAdminAll();
  if ("message" in res) {
    // выведи ошибку/заглушку
    return <div className="p-4 text-red-600">Failed to load users</div>;
  }

  return (
    <main className="p-4 space-y-4">
      <div className="grid grid-cols-1">
        <VerificationTable items={res.items} total={res.total} />
      </div>
    </main>
  );
}
