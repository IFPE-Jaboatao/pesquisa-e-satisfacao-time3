'use server';

import { apiDelete, apiPatch } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateDisciplinaAction(disciplinaId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const codigo = formData.get('codigo')?.toString();
    const cursoId = Number(formData.get('cursoId'));

    const res = await apiPatch(`/academic/disciplinas/${disciplinaId}`, { nome, codigo, cursoId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteDisciplinaAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/disciplinas/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}