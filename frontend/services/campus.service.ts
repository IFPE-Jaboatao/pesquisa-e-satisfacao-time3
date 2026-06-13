import { apiFetch } from "@/lib/api";

export async function getCampi() {
  
  const response = await apiFetch(`/institutional/campi`);

  if (response.status === 404) {
    throw new Error('Erro ao procurar campi.')
  }

  return response.json();
}

export async function getCampusFull({id}: {id: number}) {
  
  const response = await apiFetch(`/institutional/campi/${id}/full`);

  if (response.status === 404) {
    throw new Error('Campus não encontrado.')
  }

  return response.json();
}