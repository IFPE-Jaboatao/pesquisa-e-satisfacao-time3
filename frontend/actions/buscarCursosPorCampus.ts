'use server';

import { apiFetch } from "@/lib/api";

/**
 * Busca os cursos vinculados a um campus específico do gestor.
 * @param campusId ID do campus do gestor logado
 * @returns Lista de cursos encontrados
 */
export async function buscarCursosPorCampusAction(campusId: number) {
  // 1. Validação básica de entrada
  if (!campusId) {
    throw new Error("ID do campus é obrigatório.");
  }

  try {
    // 2. Chamada ao endpoint da API
    const res = await apiFetch(`/academic/cursos?campusId=${campusId}`);

    // 3. Verificação de sucesso na resposta
    if (!res.ok) {
      throw new Error("Erro ao buscar cursos no servidor.");
    }

    // 4. Retorno do JSON processado
    return await res.json();
    
  } catch (error) {
    console.error("Erro na buscarCursosPorCampusAction:", error);
    throw new Error("Não foi possível carregar os cursos do campus.");
  }
}