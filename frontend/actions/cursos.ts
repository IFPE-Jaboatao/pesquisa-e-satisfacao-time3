'use server';

import { apiDelete, apiPatch } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateCursoAction(cursoId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const campusId = Number(formData.get('campusId'));

    const res = await apiPatch(`/academic/cursos/${cursoId}`, { nome, campusId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteCursoAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/cursos/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}