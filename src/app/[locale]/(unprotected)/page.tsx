import { getI18n } from "@/locales/server";
import { MainBlock } from "./_components/main-block";
import { WhyChooseUsBlock } from "./_components/why-choose-us-block";


export default async function Home() {
  const t = await getI18n()

  return (
    <div className="">
     <MainBlock />
     <WhyChooseUsBlock />
    </div>
  );
}
