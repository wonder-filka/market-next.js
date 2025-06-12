import { getI18n } from "@/locales/server";
import LiveCryptoChart from "./_components/LiveCryptoChart";

export default async function Home() {
  const t = await getI18n()

  return (
    <div className="mt-14 p-14">
      <LiveCryptoChart />
    </div>
  );
}
