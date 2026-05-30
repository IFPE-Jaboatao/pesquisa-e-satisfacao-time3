import { cookies } from 'next/headers';

const COOKIE_NAME = 'session';

export async function setSessionCookie(token) {
    const jar = await cookies();
    jar.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1h — alinhado com expiresIn do backend
    });
}

export async function clearSessionCookie() {
    const jar = await cookies();
    jar.delete(COOKIE_NAME);
}

export async function getSessionToken() {
    const jar = await cookies();
    return jar.get(COOKIE_NAME)?.value ?? null;
}