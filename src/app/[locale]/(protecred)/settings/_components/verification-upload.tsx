'use client'

import { useState, useTransition } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useI18n } from "@/locales/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormErrorMessage } from "@/components/custom/form-error-message"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { verifyUser } from "../_actions"
import { toast } from "sonner"
import { VerificationStatus } from "../../../../../../prisma/generated/prisma"

const documentTypes = [
  { value: "passport", label: "Passport" },
  { value: "id_card", label: "ID Card" },
  { value: "driver_license", label: "Driver License" },
]

const VerificationSchema = z.object({
  file: z
    .any()
    .refine(file => file && file.length > 0, { message: "required" }),
  documentType: z.string().min(1, { message: "required" }),
})

type VerificationFormValues = z.infer<typeof VerificationSchema>

interface VerificationFormProps {
  verificationStatus: VerificationStatus,
  userId: string
}

export function VerificationForm({ verificationStatus, userId }: VerificationFormProps) {
  const t = useI18n()
  const [pending, startTransition] = useTransition()
  const [isVerifedUser, setIsVerifedUser] = useState(verificationStatus)
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      file: undefined,
      documentType: "",
    },
  })
  const { clearErrors, setError } = form
  const onSubmit: SubmitHandler<VerificationFormValues> = async (data) => {
    startTransition(async () => {
      const file = data.file?.[0]
      if (!file) return
      const updatedUser = await verifyUser(userId, data.documentType, file)
      if ("message" in updatedUser) {
        toast.error(t("verificationFailed"), {
          style: { color: 'white', backgroundColor: 'red' },
        })
      } else {
        setIsVerifedUser("PENDING")
      }
    })
  }

  if (isVerifedUser === "VERIFIED") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("verificationTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-green-600">{t("alreadyVerified")}</div>
        </CardContent>
      </Card>
    )
  }

  if (isVerifedUser === "PENDING") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("verificationTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-orange-600">{t("verificationPending")}</div>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("verificationTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("verificationDocumentType")}</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("selectADocument")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {documentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {t(type.value as keyof typeof t) || type.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormErrorMessage
                    error={form.formState.errors.documentType?.message as string | undefined}
                    t={t}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("verificationUploadDocument")}</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpeg,.jpg,.png, .webp,.heic,.heif, .pdf"
                      disabled={pending}
                      onChange={(e) => {
                        const files = e.target.files
                        const f = files?.[0]
                        if (!f) return
                        if (f.size > 10 * 1024 * 1024) {
                          setError("file", {
                            type: "manual",
                            message: "fileTooLarge",
                          })
                          return
                        }
                        clearErrors("file")
                        field.onChange(files)
                      }}
                    />
                  </FormControl>
                  <FormErrorMessage
                    error={form.formState.errors.file?.message as string | undefined}
                    t={t}
                  />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending}>
              {t("verificationSubmit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}