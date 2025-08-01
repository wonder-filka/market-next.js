import { getSessionUserId } from "@/lib/session";
import { AdminTable } from "./_components/admin-table";
import { AdminHeader } from "@/components/custom/navigation-bar-admin";
import { getUser } from "../(protecred)/accounts/_actions";
import { getUsersAssets } from "../(protecred)/_actions";
import { getAllPositionsWithRelations } from "./_actions";

export default async function Page() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }
  const user = await getUser(userId)

  if (!user) {
    return null
  }

  if (user.id !== "5f463fba-4745-4a67-9358-fcd5d2509d4d" && user.email !== "111@test.com") {
    return null
  }

  const info = await getAllPositionsWithRelations()
  const userAssets = await getUsersAssets();

  return (
    <>
      <AdminHeader />
      <main className="px-6 space-y-6">

        <AdminTable data={info} userAssets={userAssets}/>
      </main>
    </>

  )
}
