import { apiFetch } from "@/lib/api";

export async function getMatricula({id}: {id: number}) {
  
  const response = await apiFetch(`/academic/matriculas/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar matrícula.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}