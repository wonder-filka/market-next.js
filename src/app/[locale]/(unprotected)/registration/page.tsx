import { RegistrationForm } from "./_components/registration-form";
import { getI18n } from "@/locales/server";

export default async function Page() {
    const t = await getI18n()
    return (
        <div className='flex items-center justify-center p-4 mt-12'>
            <div className='mx-auto grid w-[400px] gap-6'>
                <div className='grid gap-2 text-center'>
                    <h1 className='text-3xl font-bold'>{t('register')}</h1>
                    <p className='text-balance text-muted-foreground'>{t('registerFormDescription')}</p>
                </div>
                <RegistrationForm />
            </div>

        </div>
    )

};

