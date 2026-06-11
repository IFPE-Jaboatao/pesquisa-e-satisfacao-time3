'use server';

import { apiDelete, apiPatch } from '@/lib/api';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updatePeriodoAction(periodoId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const startDate = formData.get('startDate')?.toString();
    const endDate = formData.get('endDate')?.toString();
    const ano = Number(formData.get('ano'));
    const semestre = Number(formData.get('semestre'));
    console.log(endDate)

    const res = await apiPatch(`/academic/periodos/${periodoId}`, { startDate, endDate, ano, semestre })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deletePeriodoAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/periodos/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}