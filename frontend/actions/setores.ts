'use server';

import { apiDelete, apiPatch, apiPost } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function createSetorAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPost(`/institutional/setores/`, { nome, campusId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function updateSetorAction(setorId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPatch(`/institutional/setores/${setorId}`, { nome, campusId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteSetorAction({id}: {id: number}) {
    const res = await apiDelete(`/institutional/setores/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}