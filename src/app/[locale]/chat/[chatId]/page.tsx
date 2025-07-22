import { getSessionUserId } from "@/lib/session";
import { AdminHeader } from "@/components/custom/navigation-bar-admin";
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

  if (!user) {
    return null; 
  }

  if (user.id !== "5f463fba-4745-4a67-9358-fcd5d2509d4d" && user.email !== "111@test.com") {
    return null; 
  }

  const data = await getChatAdminById(chatId)

  return (
    <>
      <AdminHeader />
      <div className="px-8 w-full flex flex-col items-center">
        <ChatMessages currentUserId={user.id} chatId={chatId} data={data}/>
      </div>
    </>
  );
}