
import { getI18n } from "@/locales/server";
import { BasicSettingsForm } from "./_components/settings-form";
import { ChangePasswordForm } from "./_components/password-form";
import { VerificationForm } from "./_components/verification-upload";
import { getUserBasicSettings } from "./_actions";
import { getSessionUserId } from "@/lib/session";


export default async function SettingsPage() {
  const t = await getI18n();
  const userId = await getSessionUserId()
  if (!userId) return
  const userBasicSettings = await getUserBasicSettings(userId)
  if (!userBasicSettings) return

  // console.log(userBasicSettings)
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{t("settingsTitle")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BasicSettingsForm data={userBasicSettings} />
        <ChangePasswordForm userId={userId}/>
        <VerificationForm isVerifed={userBasicSettings.isVerifed} userId={userId}/>
      </div>

    </div>
  );
}
