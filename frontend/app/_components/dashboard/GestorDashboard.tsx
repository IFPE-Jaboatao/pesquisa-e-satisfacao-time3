import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data?: DashboardGestor;
}

export interface DashboardGestor {
  resumo: {
    satisfacoes: {
      ativas: number,
      inativas: number,
      fechadas: number
    },
    avaliacoes: {
      ativas: number,
      inativas: number,
      fechadas: number
    }
  }
}

export function GestorDashboard({ data }: Props) {
  return (
    <div className="flex-1 p-1">
      
          <TopTitleButtons
            title="Pesquisas de Satisfação"
            title_backgroundcolor="var(--color-secondary)"
            button1_title="Ver Lista"
            button1_route="/buscar-pesquisas-satisfacao"
            button2_title="Criar Pesquisa"
            button2_route="/criar-pesquisa"
          />
    
          <div className="self-center flex-1">
            <CardsDashboard items={[
              {value: data?.resumo.satisfacoes.ativas || 0, label: 'Abertas'},
              {value: data?.resumo.satisfacoes.fechadas || 0, label: 'Finalizadas'},
              {value: data?.resumo.satisfacoes.inativas || 0, label: 'À Começar'},
            ]} />
    
            </div>
    
          <TopTitleButtons
            title="Avaliações Docente"
            title_backgroundcolor="var(--color-alt-secondary)"
            button1_title="Ver Lista"
            button1_route="/buscar-avaliacoes-docente"
            button2_title="Criar Avaliação"
            button2_route="/criar-avaliacao"
          />
    
          <div className="self-center flex-1">
            <CardsDashboard items={[
              {value: data?.resumo.avaliacoes.ativas || 0, label: 'Abertas'},
              {value: data?.resumo.avaliacoes.fechadas || 0, label: 'Finalizadas'},
              {value: data?.resumo.avaliacoes.inativas || 0, label: 'À Começar'},
            ]} />
    
            </div>
    
        </div>
  );
}