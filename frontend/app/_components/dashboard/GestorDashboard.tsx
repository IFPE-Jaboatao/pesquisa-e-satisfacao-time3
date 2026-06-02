import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data: any;
}

export function GestorDashboard({ data }: Props) {
  return (
    <div className="flex-1 p-1">
      
          <TopTitleButtons
            title="Pesquisas de Satisfação"
            title_backgroundcolor="var(--color-secondary)"
            button1_title="Ver Lista"
            button1_route="/buscar-pesquisas"
            button2_title="Criar Pesquisa"
            button2_route="/criar-pesquisa"
          />
    
          <div className="self-center flex-1">
            <CardsDashboard items={[
              {value: data.resumo.satisfacoes.ativas, label: 'Abertas'},
              {value: data.resumo.satisfacoes.fechadas, label: 'Finalizadas'},
              {value: data.resumo.satisfacoes.inativas, label: 'À Começar'},
            ]} />
    
            </div>
    
          <TopTitleButtons
            title="Avaliações Docente"
            title_backgroundcolor="var(--color-alt-secondary)"
            button1_title="Ver Lista"
            button1_route="/buscar-avaliacoes"
            button2_title="Criar Avaliação"
            button2_route="/criar-avaliacao"
          />
    
          <div className="self-center flex-1">
            <CardsDashboard items={[
              {value: data.resumo.avaliacoes.ativas, label: 'Abertas'},
              {value: data.resumo.avaliacoes.fechadas, label: 'Finalizadas'},
              {value: data.resumo.avaliacoes.inativas, label: 'À Começar'},
            ]} />
    
            </div>
    
        </div>
  );
}