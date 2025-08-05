import { getSessionUserId } from "@/lib/session";
import { ChatMessages } from "../_components/chat-messages";
import { getUser } from "../../(protecred)/accounts/_actions";
import { getChatAdminById } from "../_actions";

interface ChatPageProps {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function Page({ params }: ChatPageProps) {
  const { chatId } = await params;

  const userId = await getSessionUserId();
  if (!userId) {
    return null;
  }

  const user = await getUser(userId)
  if ("message" in user) return null;
  
  const adminId = process.env.ADMIN_ID;
  if (user.id !== adminId) {
    return null;
  }

  const data = await getChatAdminById(chatId)

  return (
    <main className="p-4 space-y-4">
      <ChatMessages currentUserId={user.id} chatId={chatId} data={data} />
    </main>
  );
}