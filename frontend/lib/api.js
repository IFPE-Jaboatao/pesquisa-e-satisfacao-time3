import { getSessionToken } from './session';

export async function apiFetch(path, init = {}) {
    const token = await getSessionToken();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${process.env.API_BASE_URL}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
        credentials: 'include', // Necessário para enviar o cookie httpOnly
    });
    return res;
}

export async function apiPost(path, data, init = {}) {
    const token = await getSessionToken();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${process.env.API_BASE_URL}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include', // Necessário para enviar o cookie httpOnly
    });

    return res;
}

export async function apiPatch(path, data, init = {}) {
    const token = await getSessionToken();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${process.env.API_BASE_URL}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
        method: 'PATCH',
        body: JSON.stringify(data),
        credentials: 'include', // Necessário para enviar o cookie httpOnly
    });

    return res;
}

export async function apiDelete(path, init = {}) {
    const token = await getSessionToken();
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${process.env.API_BASE_URL}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
        method: 'DELETE',
        credentials: 'include', // Necessário para enviar o cookie httpOnly
    });
    return res;
}