import { apiFetch } from "@/lib/api";

export async function getMe() {
    const res = await apiFetch('/users/me');

    if (res.status === 401) {
        return false
    }

    if (!res.ok) {
        throw new Error(`Falha ao carregar perfil: ${res.status}`);
    }

    const user = await res.json();

    return user;
}

export async function getUser({id}: {id: number}) {
    const res = await apiFetch('/users/' + id);

    if (res.status === 401) {
        return false
    }

    if (!res.ok) {
        if (res.status === 404) {
            return null; // Retorna null se o usuário não for encontrado
        }
        throw new Error(`Falha ao carregar usuário: ${res.status}`);
    }

    const user = await res.json();

    return user;
}