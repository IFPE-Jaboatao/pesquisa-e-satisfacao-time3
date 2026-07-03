'use server';

import { apiDelete, apiPatch, apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';


interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateSetorAction(setorId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPatch(`/institutional/setores/${setorId}`, { nome, campusId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}
}

export async function deleteSetorAction({id}: {id: number}): Promise<ActionState> {
    const res = await apiDelete(`/institutional/setores/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`, success: false, message: '' };
    }
    
    return { message: res.statusText, error: '', success: true };
}

export async function createSetorAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    if (!nome || !campusId) {
        return { error: "Nome e Campus são obrigatórios", success: false, message: '' };
    }

    const res = await apiFetch(`/institutional/setores`, {
        method: 'POST',
        body: JSON.stringify({ nome, campusId })
    });

    if (!res.ok) {
        const text = await res.json();
        return { error: text.message || "Erro ao criar setor", success: false, message: '' };
    }

    revalidatePath('/buscar-entidades/setores');

    return { message: "Setor criado com sucesso!", error: '', success: true };
}

// Adicione esta exportação ao seu arquivo existente
export async function getSetoresAction() {
    const res = await apiFetch(`/institutional/setores`, {
        method: 'GET',
    });

    if (!res.ok) {
        return []; // Retorna array vazio em caso de erro para não quebrar o .map() no form
    }

    return await res.json();
}