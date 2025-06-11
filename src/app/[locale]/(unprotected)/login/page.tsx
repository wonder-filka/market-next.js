

import { getI18n } from '@/locales/server'
import { LoginForm } from "./_components/form"


export default async function Login() {
  // const session = await auth()
  const t = await getI18n()

  // if (session) return redirect("/"
  return (
    <div className="flex flex-col-reverse justify-end w-full lg:grid min-h-screen lg:grid-cols-2 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Enter your email</h1>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="bg-muted block">
  
      </div>
    </div>
  )
}