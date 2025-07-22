import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";
import { AdminTable } from "./_components/admin-table";
import { AdminHeader } from "@/components/custom/navigation-bar-admin";

export default async function Page() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      accounts: true,
    },
  })

  if (!user) {
    return null
  }

  if (user.id !== "5f463fba-4745-4a67-9358-fcd5d2509d4d" && user.email !== "111@test.com") {
    return null
  }

  const info = await prisma.position.findMany({
    include: {
      user: {
        include: {
          wallet: true,
          accounts: true,
        },
      },
      account: true,
    }
  })


  return (
    <>
      <AdminHeader />
      <main className="px-6 space-y-6">

        <AdminTable data={info} />
      </main>
    </>

  )
}
