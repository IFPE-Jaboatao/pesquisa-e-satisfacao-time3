'use server';

import { redirect } from 'next/navigation';
import { setSessionCookie, clearSessionCookie } from '@/lib/session';
import { apiDelete, apiPatch } from '@/lib/api';
import { stringify } from 'querystring';

interface ActionState {
    error: string,
    message: string,
    success: boolean
}

export async function updateUserAction(userId: number,prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const matricula = formData.get('matricula')?.toString();
    const email = formData.get('email')?.toString();
    const role = formData.get('role')?.toString();
    const campus = Number(formData.get('campus'));

    let campusId: number | null;
    if (campus === 0)  {
        campusId = null;
    } else {
        campusId = campus;
    }

    const res = await apiPatch(`/users/${userId}`, {nome, matricula, email, role, campusId })

    if (!res.ok) {
        const text = await res.json();
        
        return { error: text.message, success: false, message: ''};
    }

    return { message: res.statusText, error: '', success: true}

}

export async function deleteUserAction({id}: {id: number}) {
    const res = await apiDelete(`/users/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
    }