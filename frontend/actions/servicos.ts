'use server';

import { apiDelete, apiPatch, apiPost } from '@/lib/api'; // Adicionado apiPost


interface ActionState {
    error: string;
    message: string;
    success: boolean;
}

// 1. NOVA: Action de Criação (Respeitando regras de unicidade no backend)
export async function createServicoAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const setorId = Number(formData.get('setorId'));

    const res = await apiPost(`/institutional/servicos`, { nome, setorId });

    if (!res.ok) {
        const text = await res.json();
        // A mensagem de erro vinda do backend conterá a regra de unicidade (Regra 5)
        return { error: text.message || "Erro ao criar serviço", success: false, message: '' };
    }

    return { message: "Serviço criado com sucesso!", error: '', success: true };
}

// 2. EXISTENTE: Update (Mantido na estrutura original)
export async function updateServicoAction(servicoId: number, prevState: ActionState, formData: FormData): Promise<ActionState> {
    const nome = formData.get('nome')?.toString();
    const setorId = Number(formData.get('setorId'));

    const res = await apiPatch(`/institutional/servicos/${servicoId}`, { nome, setorId });

    if (!res.ok) {
        const text = await res.json();
        return { error: text.message, success: false, message: '' };
    }

    return { message: res.statusText || "Atualizado com sucesso", error: '', success: true };
}

// 3. EXISTENTE: Delete (Mantido na estrutura original)
export async function deleteServicoAction({ id }: { id: number }) {
    const res = await apiDelete(`/institutional/servicos/${id}`);

    if (!res.ok) {
        return { error: `Erro: ${res.statusText}` };
    }

    return { message: res.statusText || "Deletado com sucesso" };
}