import { getSessionUserId } from "@/lib/session";
import { AdminHeader } from "@/components/custom/navigation-bar-admin";
import { ChatList } from "./_components/chat-list";;
import { getChatsAdmin } from "./_actions";
import { getUser } from "../(protecred)/accounts/_actions";

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

  const chats = await getChatsAdmin()

  return (
    <>
      <AdminHeader />
      <div className="px-8">
        <ChatList userId={user.id} data={chats}/>
      </div>
    </>

  )
}
