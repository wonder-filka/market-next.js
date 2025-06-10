
import { getI18n, getScopedI18n } from '../../locales/server'

export default async function Home() {
  const t = await getI18n()
  const scopedT = await getScopedI18n('hello')
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>{t('hello')}</p>

      {/* Both are equivalent: */}
      <p>{t('hello.world')}</p>
      <p>{scopedT('world')}</p>

      <p>{t('welcome', { name: 'John' })}</p>
      <p>{t('welcome', { name: <strong>John</strong> })}</p>
    </div>
  );
}
