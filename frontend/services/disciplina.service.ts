import { apiFetch } from "@/lib/api";

export async function getDisciplina({id}: {id: number}) {
  
  const response = await apiFetch(`/academic/disciplinas/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar disciplina.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}

export async function getDisciplinaByCurso({cursoId}: {cursoId: number}) {
  
  const response = await apiFetch(`/academic/disciplinas?cursoId=${cursoId}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar disciplinas.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}