'use server';

import { apiDelete, apiPatch } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateCampusAction(campusId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
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
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}