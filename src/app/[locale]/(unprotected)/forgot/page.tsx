
import { getI18n } from "@/locales/server";


export default async function Page() {
	const t = await getI18n()
	return (
		<div className='flex items-center justify-center p-4 my-12 mb-28 min-h-[46vh]' >
			<div className='mx-auto grid w-[400px] gap-6'>
				<div className='grid gap-2 text-center'>
					<h1 className='text-3xl font-bold'>{t('forgotPass')}</h1>
					<p className='text-balance text-muted-foreground'>{t('forgotPassDescription')}</p>
				</div>
		
			</div>

		</div>
	)

};

