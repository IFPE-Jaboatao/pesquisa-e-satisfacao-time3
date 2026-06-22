'use server';

import { apiFetch, apiPost } from '@/lib/api';

export interface Campus {
  id: number;
  nome: string;
}

/**
 * Busca a lista de campi do sistema.
 * Roda apenas no Servidor (chamada estritamente pela page.tsx).
 */
export async function fetchCampi(): Promise<Campus[]> {
  const response = await apiFetch('/users/dashboard/admin');
  
  if (!response.ok) {
    throw new Error("Erro ao carregar a lista de campi do servidor.");
  }
  
  const data = await response.json();
  return data.institutional?.campus || [];
}

/**
 * Action para criar um novo usuário.
 * Integrada com o useActionState do formulário.
 */
export async function createUserAction(prevState: any, formData: FormData) {
  // Mapeamento dos valores do formulário para os valores esperados pelo backend
  const roleMap: Record<string, string> = {
    "ALUNO": "aluno",
    "DOCENTE": "docente",
    "GESTOR": "gestor",
    "ADMIN": "admin"
  };

  const rawRole = formData.get('role') as string;
  const rawCampusId = formData.get('campusId');

  // 1. Extração dos itens do formulário
  const payload: any = {
    nome: formData.get('nome'),
    matricula: formData.get('matricula'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: roleMap[rawRole] || "aluno",
  };

  // Se não for ADMIN, o campusId é obrigatório
  if (rawRole !== "ADMIN" && rawCampusId) {
    payload.campusId = Number(rawCampusId);
  }

  // 2. Chamada à função genérica apiPost
  const res = await apiPost('/users', payload);

  // 3. Tratamento de erro e resposta
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const errorMsg = Array.isArray(data.message) ? data.message[0] : (data.message || "Erro ao processar o cadastro.");
    return { error: errorMsg, success: false };
  }

  return { success: true };
}