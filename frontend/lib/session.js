import { cookies } from 'next/headers';

const COOKIE_NAME = 'access-token';

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

export async function getMe() {
    try {
        const token = await getSessionToken();

        if (!token) {
            return null;
        }

        // Decodifica com segurança o payload do JWT (segunda parte do token)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const payload = JSON.parse(jsonPayload);

        // Retorna mapeado exatamente no padrão que as suas páginas e componentes esperam
        return {
            nome: payload.nome || payload.username || "Usuário",
            role: payload.role ? payload.role.toLowerCase() : "aluno",
            campusId: payload.campusId || null
        };
    } catch (error) {
        console.error("Erro ao decodificar sessão no getMe:", error);
        return null;
    }
}