"use client"

import { useTransition } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useI18n } from "@/locales/client"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormErrorMessage } from "@/components/custom/form-error-message"

const FeedbackSchema = z.object({
  email: z.string().email("invalidEmail"),
  message: z.string().min(10, "tooShortMessage"),
})

export function FeedbackForm() {
  const [pending, startTransition] = useTransition()
  const t = useI18n()

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof FeedbackSchema>> = async (data) => {
    startTransition(async () => {
      console.log("Submitting feedback:", data)
      form.reset()
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-black/70 rounded-3xl shadow-xl p-10">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">{t("contactsBlock.feedbackTitle")}</h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("email")} disabled={pending} {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.email?.message} t={t} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("message")}</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder={t("message") + "..."} className="min-h-[160px]" disabled={pending} {...field} />
              </FormControl>
              <FormErrorMessage error={form.formState.errors.message?.message} t={t} />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending} className="w-full mt-8">
          {t("submit")}
        </Button>
      </form>
    </Form>
  )
}
