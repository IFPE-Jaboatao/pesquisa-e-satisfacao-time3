import { apiFetch } from "@/lib/api";

export async function getSetorFull({id}: {id: number}) {
  
  const response = await apiFetch(`/institutional/setores/${id}/full`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar setor.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}

export async function getSetoresByCampus({campusId}: {campusId: number}) {
  
  const response = await apiFetch(`/institutional/setores?campusId=${campusId}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar setores.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}