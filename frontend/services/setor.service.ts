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