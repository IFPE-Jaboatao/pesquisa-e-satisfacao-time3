'use server';

import { apiDelete, apiPatch, apiFetch, apiPost } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

// --- Funções existentes da sua equipe ---

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

    return { message: res.statusText, error: '', success: true}
}

export async function deleteCampusAction({id}: {id: number}) {
    const res = await apiDelete(`/institutional/campi/${id}`)

    if (!res.ok) {
        // Corrigido: estrutura completa de ActionState
        return { error: `Erro: ${res.statusText}`, success: false, message: '' };
    }
    
    // Corrigido: estrutura completa de ActionState
    return { message: res.statusText, error: '', success: true };
}

// --- Nova função adicionada para o formulário de criação ---

/**
 * Busca a lista de todos os campi para popular o select dinâmico
 */
export async function getCampiAction() {
    try {
        const res = await apiFetch(`/institutional/campi`);
        
        if (!res.ok) {
            throw new Error("Erro ao buscar a lista de campi.");
        }

        return await res.json();
    } catch (error) {
        console.error("Erro na getCampiAction:", error);
        throw error;
    }
}