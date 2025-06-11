"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createSession } from "@/lib/session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(1, {
        message: "Password is required"
    }).min(6, {
        message: "Password must be more than 8 characters"
    }).max(32, { message: "Password must be less than 32 characters" }),
})

export const LoginForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            form.reset();
            // await createSession(user.id)
            router.push('/profile');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" {...field} placeholder="Password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && (
                    <p className="text-red-500">{error}</p>
                )}
                <Button className="w-full" type="submit">Submit</Button>
            </form>
        </Form>
    );
};