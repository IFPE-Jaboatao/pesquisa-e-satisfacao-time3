'use server';

import { apiDelete, apiPost } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function deleteMatriculaAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/matriculas/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}

export async function createMatriculaAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const alunoId = Number(formData.get('alunoId'));
    const turmaId = Number(formData.get('turmaId'));

    const res = await apiPost(`/academic/matriculas`, { turmaId, alunoId });

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}