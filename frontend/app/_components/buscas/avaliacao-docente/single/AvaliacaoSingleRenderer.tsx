import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoSingleAluno from "./AvaliacaoSingleAluno";
import { getRelatorioAvaliacao } from "@/services/pesquisas.service";
import AvaliacaoSingleResultado from "./AvaliacaoSingleResultado";
import { AvaliacaoDocenteAluno, AvaliacaoDocenteGestor } from "../interface";

interface Props {
  role: UserRole;
  avaliacaoAluno?: AvaliacaoDocenteAluno,
  avaliacao?: AvaliacaoDocenteGestor
  };

export async function AvaliacaoSingleRenderer({ role, avaliacaoAluno, avaliacao }: Props) {
    let relatorio;

  switch (role) {
    case UserRole.ALUNO:
      return <AvaliacaoSingleAluno avaliacao={avaliacaoAluno} />;

    case UserRole.GESTOR:
        relatorio = await getRelatorioAvaliacao({id: avaliacao?.id || '0'})
      return <AvaliacaoSingleResultado avaliacao={relatorio} />;

    case UserRole.DOCENTE:
        relatorio = await getRelatorioAvaliacao({id: avaliacao?.id || '0'})
      return <AvaliacaoSingleResultado avaliacao={relatorio} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}