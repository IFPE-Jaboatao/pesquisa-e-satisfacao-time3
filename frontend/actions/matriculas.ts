'use server';

import { apiDelete } from '@/lib/api';


export async function deleteMatriculaAction({id}: {id: number}) {
    const res = await apiDelete(`/academic/matriculas/${id}`)

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}`} };
    
    return {message: res.statusText} 
    
}