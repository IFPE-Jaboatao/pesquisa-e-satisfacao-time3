import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data: any;
}

export function DocenteDashboard({ data }: Props) {
  return (
        <div className="flex-1 p-1">
        
            <TopTitleButtons
              title="Minhas Avaliações"
              title_backgroundcolor="var(--color-alt-secondary)"
              button1_title="Ver Lista"
              button1_route="/buscar-avaliacoes"
            />
      
            <div className="self-center flex-1">
              <CardsDashboard items={[
                {value: data.avaliacoes.avaliacoes.ativas.length, label: 'Abertas'},
                {value: data.avaliacoes.avaliacoes.fechadas.length, label: 'Finalizadas'},
                {value: data.avaliacoes.avaliacoes.inativas.length, label: 'À Começar'},
              ]} />
      
              </div>
      
            <TopTitleButtons
              title="Meus Indicadores"
              title_backgroundcolor="var(--color-tertiary)"
              buttons={false}
            />
      
            <div className="self-center flex-1">
              <p>Graficos em breve...</p>
              </div>
      
          </div>
  );
}