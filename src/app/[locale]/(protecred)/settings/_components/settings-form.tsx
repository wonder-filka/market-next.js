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

const basicSchema = z.object({
  firstName: z.string().min(2, "minFirstName"),
  lastName: z.string().min(2, "minLastName"),
  email: z.string().email("invalidEmail"),
  phone: z.string().min(7, "invalidPhone"),
})

type BasicSettingsFormValues = z.infer<typeof basicSchema>

export function BasicSettingsForm() {
  const t = useI18n()
  const [pending, startTransition] = useTransition()

  const form = useForm<BasicSettingsFormValues>({
    resolver: zodResolver(basicSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const onSubmit: SubmitHandler<BasicSettingsFormValues> = async (values) => {
    startTransition(() => {
      console.log(values)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("basicSettings")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("firstName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} placeholder={t("firstName")} {...field} />
                  </FormControl>
                  <FormErrorMessage error={form.formState.errors.firstName?.message} t={t} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("lastName")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} placeholder={t("lastName")} {...field} />
                  </FormControl>
                  <FormErrorMessage error={form.formState.errors.lastName?.message} t={t} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} placeholder={t("email")} {...field} />
                  </FormControl>
                  <FormErrorMessage error={form.formState.errors.email?.message} t={t} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input disabled={pending} placeholder={t("phone")} {...field} />
                  </FormControl>
                  <FormErrorMessage error={form.formState.errors.phone?.message} t={t} />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending} className="mt-4">
              {t("save")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}