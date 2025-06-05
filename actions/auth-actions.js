'use server';

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
    const email = formData.get('email')
    const password = formData.get('password')
    let errors = {}
    if (!email.includes('@')) {
        errors.email = 'No valid email'
    }
    if (password.trim().length < 8) {
        errors.password = 'No valid password'
    }
    if (Object.keys(formState.errors).length > 0) {
        return {
            errors
        }
    }
    try {
        const id = createUser(email, hashUserPassword(password))
        await createAuthSession(id)
        redirect('/training');

    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                errors: {
                    email: 'email already exists'
                }
            }
        }
        throw error;
    }

} 