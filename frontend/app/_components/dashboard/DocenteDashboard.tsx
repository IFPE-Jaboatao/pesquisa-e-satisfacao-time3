import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";
import CriteriosDocente, { CriterioItem } from "./CriteriosDocente";
import KpiDocente from "./KpiDocente";
import { AvaliacaoDocenteDocente } from "../buscas/avaliacao-docente/interface";

interface Props {
  data?: DashboardDocente;
}

export interface DashboardDocente {
  avaliacoes: {
    avaliacoes: {
      ativas: AvaliacaoDocenteDocente[],
      inativas: AvaliacaoDocenteDocente[],
      fechadas: AvaliacaoDocenteDocente[],
    },
    totalRespostasRecebidas: number,
    desempenhoGeral: CriterioItem[],
    mediaGeralHistorica: string
  }
}

export function DocenteDashboard({ data }: Props) {
  return (
        <div className="flex-1 p-1">
        
            <TopTitleButtons
              title="Minhas Avaliações"
              title_backgroundcolor="var(--color-alt-secondary)"
              button1_title="Ver Lista"
              button1_route="/buscar-avaliacoes-docente"
            />
      
            <div className="self-center flex-1">
              <CardsDashboard items={[
                {value: data?.avaliacoes.avaliacoes.ativas.length || 0, label: 'Abertas'},
                {value: data?.avaliacoes.avaliacoes.fechadas.length || 0, label: 'Finalizadas'},
                {value: data?.avaliacoes.avaliacoes.inativas.length || 0, label: 'À Começar'},
              ]} />
      
              </div>
      
            <TopTitleButtons
              title="Meus Indicadores"
              title_backgroundcolor="var(--color-tertiary)"
              buttons={false}
            />
      
            <div className="self-center flex-1 shadow-gray-300 shadow-lg mb-5">
              <div className="p-4 flex flex-row max-lg:flex-col justify-center items-center gap-5 align-middle" style={{ backgroundColor: 'var(--white)'}}>
                <div className="flex-2">
                  {data?.avaliacoes.totalRespostasRecebidas && data?.avaliacoes.totalRespostasRecebidas > 0
                  ? <CriteriosDocente items={data?.avaliacoes.desempenhoGeral  || []} />
                : <p>Nenhuma resposta ainda...</p>}
                
                </div>

              <div className="flex-1">
                <KpiDocente value={data?.avaliacoes.mediaGeralHistorica === 'NaN%' ? 0 : Number(data?.avaliacoes.mediaGeralHistorica.replace('%', ''))} />
              </div>

              </div>

              </div>
      
          </div>
  );
}