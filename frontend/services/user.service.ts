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