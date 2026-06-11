import { apiFetch } from "@/lib/api";

export async function getPeriodos() {
  
  const response = await apiFetch(`/academic/periodos`);

  if (response.status === 404) {
    throw new Error('Erro ao procurar períodos.')
  }

  return response.json();
}