import { apiFetch } from "@/lib/api";

export async function getServico({id}: {id: number}) {
  
  const response = await apiFetch(`/institutional/servicos/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
        return {error: 'Erro ao procurar serviço.'}
    }
    const text = await response.json();

    return {error: `Erro ${response.status}: ${text.message}`}
  }

  return response.json();
}