'use server';

import { apiDelete, apiPatch, apiPost } from '@/lib/api';
import { revalidatePath } from 'next/cache';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

// --- Funções de Criação (Adicionada) ---

export async function createCursoAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPost('/academic/cursos', { nome, campusId });

    if (!res.ok) {
        const text = await res.json();
        return { error: text.message || 'Erro ao criar curso', success: false, message: '' };
    }

    revalidatePath('/buscar-entidades/cursos');
    return { message: 'Curso criado com sucesso!', error: '', success: true };
}

// --- Funções existentes ---

export async function updateCursoAction(cursoId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPatch(`/academic/cursos/${cursoId}`, { nome, campusId });

    if (!res.ok) {
        const text = await res.json();
        return { error: text.message, success: false, message: '' };
    }

    return { message: res.statusText || 'Curso atualizado com sucesso', error: '', success: true };
}

export async function deleteCursoAction({id}: {id: number}): Promise<ActionState> {
    const res = await apiDelete(`/academic/cursos/${id}`);

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`, success: false, message: '' };
    }
    
    return { message: res.statusText || 'Curso deletado com sucesso', error: '', success: true };
}