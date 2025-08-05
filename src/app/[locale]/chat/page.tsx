import { getSessionUserId } from "@/lib/session";
import { ChatList } from "./_components/chat-list";;
import { getChatsAdmin } from "./_actions";
import { getUser } from "../(protecred)/accounts/_actions";

export default async function Page() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }
  const user = await getUser(userId)
  if ("message" in user) return null;

  const adminId = process.env.ADMIN_ID;
  if (user.id !== adminId) {
    return null
  }

  const chats = await getChatsAdmin()

  return (
    <main className="p-4 space-y-4">
      <ChatList userId={user.id} data={chats} />
    </main>

  )
}
