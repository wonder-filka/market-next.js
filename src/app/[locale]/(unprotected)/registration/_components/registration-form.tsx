'use client';

import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegistrationSchema } from "@/lib/schemas";
import { useI18n } from "@/locales/client";
import { signup } from "../_actions";

import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/custom/form-error-message";


export const RegistrationForm = () => {

    const [pending, startTransition] = useTransition()
    const t = useI18n()

    const form = useForm<z.infer<typeof RegistrationSchema>>({
        resolver: zodResolver(RegistrationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            currency: 'USD'
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof RegistrationSchema>> = async data => {
        startTransition(async () => {
                const result = await signup(data);
                if (result?.message === "emailExists") {
                    form.setError("email", {
                        type: "manual",
                        message: "emailExists",
                    });
                } else if (result?.message === "phoneExists") {
                    form.setError("phone", {
                        type: "manual",
                        message: "phoneExists",
                    });
                }
        })
    }

    return (
        <Form {...form} >
            <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('firstName')}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} placeholder={t('firstName')} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.firstName?.message}
                                t={t}
                            />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('lastName')}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} placeholder={t('lastName')} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.lastName?.message}
                                t={t}
                            />

                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('email')}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} placeholder={t('email')} {...field} />
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
                    name='phone'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('phone')}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} placeholder={t('phone')} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.phone?.message}
                                t={t}
                            />

                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('password')}</FormLabel>
                            <FormControl>
                                <Input disabled={pending} type='password' placeholder={t('password')} {...field} />
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.password?.message}
                                t={t}
                            />

                        </FormItem>
                    )}
                />
                {/* <FormField
                    control={form.control}
                    name='currency'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('currency')}</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    disabled={pending}
                                    className="border rounded px-3 py-2 w-full text-sm"
                                >
                                    <option className="bg-black hover:bg-accent-foreground" value="USD">🇺🇸 USD</option>
                                    <option className="bg-black hover:bg-accent-foreground"  value="EUR">🇪🇺 EUR</option>
                                    <option className="bg-black hover:bg-accent-foreground"  value="GBP">🇬🇧 GBP</option>
                                    <option className="bg-black hover:bg-accent-foreground"  value="RUB">🇷🇺 RUB</option>
                                </select>
                            </FormControl>
                            <FormErrorMessage
                                error={form.formState.errors.currency?.message}
                                t={t}
                            />
                        </FormItem>
                    )}
                /> */}
                <Button disabled={pending} type='submit' className='w-full mt-12'>
                    {t('register')}
                </Button>
            </form>
        </Form>
    )
};
