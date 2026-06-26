import { apiFetch } from "@/lib/api";

/**
 * Funções focadas apenas em Avaliação Docente.
 * Estas funções são destinadas a serem chamadas exclusivamente em Server Components (page.tsx)
 * ou Server Actions, garantindo acesso seguro aos cookies de autenticação.
 */

/**
 * GET: Busca os critérios da avaliação docente.
 * Rota: /surveys/pesquisas/avaliacao/criterios
 */
export async function getCriteriosAvaliacaoDocenteService() {
  try {
    const res = await apiFetch(`/surveys/pesquisas/avaliacao/criterios`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar critérios da avaliação docente.");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Service Error [getCriterios]:", error);
    throw error;
  }
}

/**
 * GET: Busca cursos do campus do gestor logado.
 * Rota: /academic/cursos/meu-campus
 */
export async function getCursosPorCampusService() {
  try {
    const res = await apiFetch(`/academic/cursos/meu-campus`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar cursos do campus.");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Service Error [getCursos]:", error);
    throw error;
  }
}