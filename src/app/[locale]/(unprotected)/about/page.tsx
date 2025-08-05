import { FinalCtaBlock } from "../_components/final-cta-block";
import { CompanyIntroBlock } from "./_components/company-intro-block";
import { CompanyValuesBlock } from "./_components/company-values-block";
import { TeamBlock } from "./_components/team-block";
import { TrustStatsBlock } from "./_components/trust-stats-block";


export default async function AboutPage() {
  return (
    <div className="max-w-screen">
      <CompanyIntroBlock />
      <CompanyValuesBlock />
      <TeamBlock />
      <TrustStatsBlock />
      <FinalCtaBlock />
    </div>
  );
}
