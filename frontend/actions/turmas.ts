'use server';

import { apiDelete, apiPatch } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateTurmaAction(turmaId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const turno = formData.get('turno')?.toString();
    const disciplinaId = Number(formData.get('disciplinaId'));
    const periodoId = Number(formData.get('periodoId'));
    const docenteId = Number(formData.get('docenteId'));

    const res = await apiPatch(`/academic/turmas/${turmaId}`, { turno, disciplinaId, periodoId, docenteId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteTurmaAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/turmas/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}