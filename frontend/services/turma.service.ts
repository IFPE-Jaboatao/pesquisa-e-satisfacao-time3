import { apiFetch } from "@/lib/api";

export async function getTurma({id}: {id: number}) {
  
  const response = await apiFetch(`/academic/turmas/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar turma.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}