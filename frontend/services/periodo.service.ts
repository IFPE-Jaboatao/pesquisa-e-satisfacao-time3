import { apiFetch } from "@/lib/api";

export async function getPeriodos() {
  
  const response = await apiFetch(`/academic/periodos`);

  if (response.status === 404) {
    throw new Error('Erro ao procurar períodos.')
  }

  return response.json();
}

export async function getPeriodo({ id }: { id: number }) {
  
  const response = await apiFetch(`/academic/periodos/${id}`);

  if (response.status === 404) {
    throw new Error('Erro ao procurar período.')
  }

  return response.json();
}