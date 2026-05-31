'use server';

import { redirect } from 'next/navigation';
import { setSessionCookie, clearSessionCookie } from '@/lib/session';

interface ActionState {
    error: string;
}

export async function loginAction(prevState: ActionState, formData: FormData) {
    const matricula = formData.get('matricula') as string;
    const password = formData.get('password') as string;

    const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula, password }),
        cache: 'no-store',
    });

    if (!res.ok) {
        return { error: 'Credenciais inválidas' };
    }

    const { access_token } = await res.json();
    await setSessionCookie(access_token);
    redirect('/home');
}

export async function logoutAction() {
    await clearSessionCookie();
    redirect('/login');
}