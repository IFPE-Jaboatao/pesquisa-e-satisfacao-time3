import CardsDashboard from "./CardsDashboard";
import TopTitleButtons from "./TopTitleButtons";

interface Props {
  data: any;
}

export function AlunoDashboard({ data }: Props) {
  return (
    <div className="flex-1 p-1 ml-70 mr-70 max-sm:ml-10 max-sm:mr-10 max-md:mr-15 max-md:ml-15 max-lg:ml-30 max-lg:mr-30">

              <TopTitleButtons
                title="Pesquisas de Satisfação"
                title_backgroundcolor="var(--color-secondary)"
                button1_title="Ver Lista"
                button1_route="/buscar-pesquisas-satisfacao"
              />
        
              <div className="">
                <CardsDashboard items={[
                  {value: data.satisfacoesResponder, label: 'Responder'},
                ]} />
        
                </div>

              <TopTitleButtons
                title="Avaliações Docente"
                title_backgroundcolor="var(--color-alt-secondary)"
                button1_title="Ver Lista"
                button1_route="/buscar-avaliacoes-docente"
              />
        
              <div className="self-center flex-1">
                <CardsDashboard items={[
                  {value: data.avaliacoesResponder, label: 'Responder'},
                ]} />
        
                </div>
        
            </div>
  );
}