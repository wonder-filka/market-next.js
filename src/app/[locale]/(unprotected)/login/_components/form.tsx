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
import { login } from "../_actions";
import { FormErrorMessage } from "@/components/custom/form-error-message";

export const LoginForm = () => {
    const [pending, startTransition] = useTransition();
    const t = useI18n();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = async data => {
        startTransition(async () => {
            const result = await login(data);
            if (result?.message === 'incorrectCredentials') {
                form.setError('email', {
                    type: 'manual',
                    message: "incorrectCredentials",
                });
            }
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("password")}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} type="password" placeholder={t("password")} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.password?.message}
                                t={t}
                            />
                        </FormItem>
                    )}
                />
                <Button disabled={pending} type="submit" className="w-full mt-12">
                    {t("login")}
                </Button>
            </form>
        </Form>
    );
};
