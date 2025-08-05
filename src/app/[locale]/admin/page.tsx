import { getSessionUserId } from "@/lib/session";
import { AdminTable } from "./_components/admin-table";
import { getUser } from "../(protecred)/accounts/_actions";
import { getUsersAssets } from "../(protecred)/_actions";
import { getAllPositionsWithRelations } from "./_actions";

export default async function Page() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }
  const user = await getUser(userId)
  const adminId = process.env.ADMIN_ID;
  if ("message" in user) return null;

  if (user.id !== adminId) {
    return null
  }

  const info = await getAllPositionsWithRelations()
  const userAssets = await getUsersAssets();

  return (
    <main className="p-4 space-y-4">
      <div className="grid grid-cols-1">
        <AdminTable data={info} userAssets={userAssets} />
      </div>
    </main>

  )
}
