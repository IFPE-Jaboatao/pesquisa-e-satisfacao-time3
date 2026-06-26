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
 * Busca a estrutura da pesquisa completa utilizando o client do time
 */
export async function getPesquisaCompleta({ id }: Props): Promise<RelatorioAvaliacao | null | false> {
  try {
    const res = await apiFetch(`/surveys/pesquisas/${id}/complete`);

    // Trata a falta de permissão/token expirado conforme seu padrão
    if (res.status === 401) {
      return false;
    }

    if (!res.ok) {
      const text = await res.json();
      console.error(`Falha ao carregar pesquisa: ${res.status}, ${text.message}`);
      return null;
    }

    const pesquisa = await res.json();
    return pesquisa as RelatorioAvaliacao;
  } catch (error) {
    console.error("Erro de conexão na camada de serviço:", error);
    return null;
  }
}

/**
 * Busca o relatório de avaliação do docente
 */
export async function getRelatorioAvaliacao({ id }: Props) {
  const res = await apiFetch(`/surveys/pesquisas/${id}/relatorio/docente`);
  console.log(`/surveys/pesquisas/${id}/relatorio/docente`);
  
  if (res.status === 401) {
    return false;
  }

  if (!res.ok) {
    const text = await res.json();
    throw new Error(`Falha ao carregar pesquisa: ${res.status}, ${text.message}`);
  }

  const pesquisa = await res.json();
  return pesquisa;
}

/**
 * Busca serviços cadastrados por campus
 */
export async function getServicosPorCampus(): Promise<any[]> {
  const res = await apiFetch("/institutional/servicos");

  if (res.status === 401) {
    return []; // Retornar um array vazio evita que o .map() quebre na tela se falhar
  }

  if (!res.ok) {
    throw new Error(`Falha ao carregar serviços: ${res.status}`);
  }

  const servicos = await res.json();
  return servicos || [];
}

/**
 * Busca setores com serviços baseados no ID do campus
 */
export async function getSetoresComServicosPorCampus(campusId: number): Promise<any[]> {
  const res = await apiFetch(`/institutional/setores?campusId=${campusId}`);

  if (res.status === 401) {
    return [];
  }

  if (!res.ok) {
    throw new Error(`Falha ao carregar setores do campus: ${res.status}`);
  }

  const setores = await res.json();
  return setores || [];
}