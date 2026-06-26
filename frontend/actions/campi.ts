'use server';

import { apiDelete, apiPatch, apiFetch, apiPost } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

// --- Funções existentes ---

export async function createCampusAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const cidade = formData.get('cidade')?.toString();

    const res = await apiPost(`/institutional/campi/`, { nome, cidade })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}
}

export async function updateCampusAction(campusId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const cidade = formData.get('cidade')?.toString();

    const res = await apiPatch(`/institutional/campi/${campusId}`, { nome, cidade })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText || "Atualizado com sucesso", error: '', success: true}
}

export async function deleteCampusAction({id}: {id: number}): Promise<ActionState> {
    const res = await apiDelete(`/institutional/campi/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`, success: false, message: '' };
    }
    
    return { message: res.statusText || "Deletado com sucesso", error: '', success: true };
}

// --- Nova função de listagem otimizada ---

/**
 * Busca a lista de todos os campi para popular o select dinâmico
 */
export async function getCampiAction() {
    try {
        const res = await apiFetch(`/institutional/campi`);
        
        if (!res.ok) {
            console.error("Erro ao buscar a lista de campi:", res.statusText);
            return []; // Retorna array vazio para não quebrar o .map() no form
        }

        return await res.json();
    } catch (error) {
        console.error("Erro na conexão com getCampiAction:", error);
        return []; // Retorna array vazio em caso de erro de rede
    }
}