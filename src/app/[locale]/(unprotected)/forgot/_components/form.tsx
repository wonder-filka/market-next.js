'use client'

import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/schemas";
import { useI18n } from "@/locales/client";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { FormErrorMessage } from "@/components/custom/form-error-message";
import { redirect } from "next/navigation";
import Link from "next/link";

export const ForgotForm = () => {
    const [pending, startTransition] = useTransition();
    const t = useI18n();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
      
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async data => {
        startTransition(async () => {
            const result = await 
           
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("email")}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} type="email" placeholder={t("email")} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.email?.message}
                                t={t}
                            />
                        </FormItem>
                    )}
                />
                <Button disabled={pending} type="submit" className="w-full mt-8">
                    {t("")}
                </Button>
            </form>
        </Form>
    );
};
