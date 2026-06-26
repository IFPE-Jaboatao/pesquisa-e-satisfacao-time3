'use server';

import { apiDelete, apiPatch, apiPost } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateServicoAction(servicoId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const setorId = Number(formData.get('setorId'));

    const res = await apiPatch(`/institutional/servicos/${servicoId}`, { nome, setorId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteServicoAction({id}: {id: number}) {
    const res = await apiDelete(`/institutional/servicos/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}