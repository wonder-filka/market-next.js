'use client'

import { useTransition } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useI18n } from "@/locales/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormErrorMessage } from "@/components/custom/form-error-message"

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "shortPassword"),
  newPassword: z.string().min(6, "shortPassword").max(64, "longPassword"),
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function ChangePasswordForm() {
  const t = useI18n()
  const [pending, startTransition] = useTransition()

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const onSubmit: SubmitHandler<PasswordFormValues> = async (values) => {
    startTransition(async () => {
      // Replace with your password update logic
      console.log("Password update:", values)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("changePasswordTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currentPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("currentPassword")}
                      disabled={pending}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage
                    error={form.formState.errors.currentPassword?.message}
                    t={t}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("newPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("newPassword")}
                      disabled={pending}
                      {...field}
                    />
                  </FormControl>
                  <FormErrorMessage
                    error={form.formState.errors.newPassword?.message}
                    t={t}
                  />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending} className=" mt-8">
              {t("updatePassword")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}