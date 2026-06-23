// services/pesquisaService.ts
import { apiFetch } from "@/lib/api";

// Tipagem das métricas que vão alimentar os gráficos da tela
export interface MetricaAvaliacao {
  criterio: string;     // Ex: "Didática", "Pontualidade"
  nota: number;         // Ex: 4.5
  mediaGlobal: number;   // Ex: 4.2
}

// Interface principal adaptada para o retorno do seu endpoint
export interface RelatorioAvaliacao {
  id: string;
  docenteNome: string;
  disciplina: string;
  periodo: string;
  totalRespostas: number;
  notaGeral: number;     // Nota de destaque do dashboard (Ex: 9.2)
  metricas: MetricaAvaliacao[];
}

interface Props {
  id: string;
}

/**
 * Busca o relatório e a estrutura da pesquisa completa utilizando o client do time
 */
export async function getPesquisaCompleta({ id }: Props): Promise<RelatorioAvaliacao | null | false> {
  try {
    const res = await apiFetch(`/surveys/pesquisas/${id}/complete`);

    // Trata a falta de permissão/token expirado conforme seu padrão
    if (res.status === 401) {
      return false;
    }

    if (!res.ok) {
      console.error(`Falha ao carregar pesquisa: ${res.status}`);
      return null;
    }

    const pesquisa = await res.json();
    return pesquisa as RelatorioAvaliacao;
  } catch (error) {
    console.error("Erro de conexão na camada de serviço:", error);
    return null;
  }
}