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
import { FormErrorMessage } from "@/components/custom/FormErrorMessage";


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
        },
    })

    const onSubmit: SubmitHandler<z.infer<typeof RegistrationSchema>> = async data => {
        startTransition(async () => {
            try {
                await signup(data);
            } catch (error) {
                if (error instanceof Error && error.message === "userExists") {
                    form.setError('email', {
                        type: 'manual',
                        message: "userExists", 
                    });
                }
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
                <Button disabled={pending} type='submit' className='w-full mt-12'>
                    {t('register')}
                </Button>
            </form>
        </Form>
    )
};
