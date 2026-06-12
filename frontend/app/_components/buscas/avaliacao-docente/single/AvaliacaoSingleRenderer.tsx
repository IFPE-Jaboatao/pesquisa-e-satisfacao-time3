import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoSingleAluno from "./AvaliacaoSingleAluno";
import { getRelatorioAvaliacao } from "@/services/pesquisas.service";
import AvaliacaoSingleResultado from "./AvaliacaoSingleResultado";

interface Props {
  role: UserRole;
  data: any;
}

export async function AvaliacaoSingleRenderer({ role, data }: Props) {
    let relatorio;

  switch (role) {
    case UserRole.ALUNO:
      return <AvaliacaoSingleAluno avaliacao={data} />;

    case UserRole.GESTOR:
        relatorio = await getRelatorioAvaliacao({id: data.id})
      return <AvaliacaoSingleResultado avaliacao={relatorio} />;

    case UserRole.DOCENTE:
        relatorio = await getRelatorioAvaliacao({id: data.id})
      return <AvaliacaoSingleResultado avaliacao={relatorio} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}