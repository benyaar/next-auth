'use server';

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
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
    if (Object.keys(errors).length > 0) {
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

export  async function login(prevState, formData){
    const email = formData.get('email')
    const password = formData.get('password')
    const existingUser = getUserByEmail(email)
    if(!existingUser){
        return {
            errors: {
                email: 'Check credentials'
            }
        }
    }
    const isValidPassword = verifyPassword(existingUser.password, password)
    if(!isValidPassword){
        return {
            errors: {
                email: 'Check credentials'
            }
        }
    }
     await createAuthSession(existingUser.id)
        redirect('/training');
}

export async function auth (mode, prevState, formData){
    if(mode === 'login'){
        return login(prevState, formData)
    }
     return signup(prevState, formData)
}

export async function logout(params) {
    await destroySession()
    redirect('/')
}