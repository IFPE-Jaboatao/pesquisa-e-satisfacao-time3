// services/pesquisaService.ts
import { apiFetch } from "@/lib/api";

// Interface mapeando exatamente os dados que a tela da Ádila consome
export interface PesquisaData {
  id: string;
  titulo?: string;
  tipo?: string;
  status?: "ATIVA" | "INATIVA" | "FINALIZADA" | string;
  totalRespostas?: number;
  mediaAprovacao?: number;
  periodo?: string;
  percentualExcelente?: number;
  percentualRegular?: number;
  percentualRuim?: number;
}

interface Props {
  id: string;
}

/**
 * Busca o relatório real da pesquisa no backend (Código Definitivo)
 */
export async function getPesquisaCompleta({ id }: Props): Promise<PesquisaData | null | false> {
  try {
    // Rota correta integrada ao controller do NestJS
    const res = await apiFetch(`/surveys/pesquisas/${id}/relatorio`);

    // Trata a falta de autorização (401) para acionar a barreira do Middleware
    if (res.status === 401) {
      return false;
    }

    // Se o backend retornar erro (Ex: 404 ou 500), evita a quebra do app
    if (!res.ok) {
      console.error(`Falha ao carregar relatório da pesquisa: ${res.status}`);
      return null;
    }

    // Retorna os dados puramente vindos do banco de dados
    const pesquisa = await res.json();
    return pesquisa as PesquisaData;
  } catch (error) {
    console.error("Erro de conexão na camada de serviço:", error);
    return null;
  }
}