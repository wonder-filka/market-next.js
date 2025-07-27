import { getI18n } from "@/locales/server";
import { MainBlock } from "./_components/main-block";
import { WhyChooseUsBlock } from "./_components/why-choose-us-block";
import { ReviewsBlock } from "./_components/reviews-block";
import { WelcomeSupportBlock } from "./_components/welcome-support-block";
import { FinalCtaBlock } from "./_components/final-cta-block";



export default async function Home() {
  const t = await getI18n()

  return (
    <div className="max-w-screen">
      <MainBlock />
      <WhyChooseUsBlock />
      <ReviewsBlock />
      <WelcomeSupportBlock />
      <FinalCtaBlock />
    </div>
  );
}
