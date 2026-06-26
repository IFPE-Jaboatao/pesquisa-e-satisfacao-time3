'use server';

import { apiPost } from "@/lib/api";
import { BuscaParams } from "@/app/_components/forms/CriarAvaliacaoForm";

/**
 * Action para buscar turmas disponíveis para avaliação (POST).
 * Usada no cliente após submissão do formulário.
 */
export async function buscarTurmasAction(params: BuscaParams) {
  const { cursoId, periodoId } = params;

  if (!cursoId || !periodoId) {
    throw new Error("ID do Curso e ID do Período são obrigatórios.");
  }

  try {
    const res = await apiPost(
      `/academic/turmas/avaliacoes-disponiveis`, { cursoId, periodoId }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar turmas na API.");
    }

    return await res.json();
  } catch (error) {
    console.error("Erro na buscarTurmasAction:", error);
    throw error;
  }
}

/**
 * Persiste a criação final da avaliação no sistema (POST).
 * Usada no cliente para concluir o fluxo.
 */
export async function criarAvaliacaoAction(dados: any) {
  try {
    const res = await apiPost(`/surveys/pesquisas/avaliacao/periodo`, dados);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao persistir avaliação docente.");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Erro na criarAvaliacaoAction:", error);
    throw error;
  }
}