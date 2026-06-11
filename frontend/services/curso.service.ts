import { apiFetch } from "@/lib/api";

export async function getCursoFull({id}: {id: number}) {
  
  const response = await apiFetch(`/academic/cursos/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar curso.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}

export async function getCursosByCampus({campusId}: {campusId: number}) {
  
  const response = await apiFetch(`/academic/cursos?campusId=${campusId}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar cursos.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}