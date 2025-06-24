
import { getI18n } from "@/locales/server";
import { BasicSettingsForm } from "./_components/settings-form";
import { ChangePasswordForm } from "./_components/password-form";
import { VerificationForm } from "./_components/verification-upload";


export default async function SettingsPage() {
  const t = await getI18n();

  const fakeUser = {
    name: "Lena Demo",
    email: "lena@example.com",
    language: "en",
    timezone: "Europe/Berlin",
    isVerified: false,
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{t("settingsTitle")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     <BasicSettingsForm />
      <ChangePasswordForm />
      <VerificationForm />
      </div>
 
    </div>
  );
}
