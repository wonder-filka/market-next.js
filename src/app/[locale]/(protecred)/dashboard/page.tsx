import { getSessionUserId } from "@/lib/session";
import { getRates } from "@/lib/rates";
import { getUser } from "../accounts/_actions";
import { getUserAssets } from "../_actions";
import { Overview } from "./_components/overwiew";


export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if ("message" in user) return null;

  const rates = await getRates();
  const safeRates: Record<string, number> = Object.fromEntries(
    Object.entries(rates)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => typeof v === "number" && !isNaN(v))
      .map(([k, v]) => [k, v as number])
  );

  const userAssets = await getUserAssets(userId);
  return (
    <main className="p-4 space-y-4">
      <Overview user={user} userAssets={userAssets} userId={userId} rates={safeRates} />
    </main>
  )
}
