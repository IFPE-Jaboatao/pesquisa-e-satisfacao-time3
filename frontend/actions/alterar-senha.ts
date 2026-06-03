'use server';

import { apiPatch } from "@/lib/api";

interface ActionState {
    error: string;
    success: boolean
}

export async function alterarSenhaAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const password = formData.get('senhaNova') as string;
    const passwordAtual = formData.get('senhaAtual') as string;

    const res = await apiPatch('/users/me/password', {password, passwordAtual})

    if (!res.ok) {
        if (res.status === 400) return { error: 'Senha nova não pode ser igual à atual.', success: false}
        else if (res.status === 401) return { error: 'Senha atual incorreta!', success: false}
        else return { error: res.statusText, success: false };
    }
    console.log("estou aqui prontinho para enviar a lacrada")
    return { success: true, error: ''}

}