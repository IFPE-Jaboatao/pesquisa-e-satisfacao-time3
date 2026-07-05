import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoSingleAluno from "./AvaliacaoSingleAluno";
import { getRelatorioAvaliacao } from "@/services/pesquisas.service";
import AvaliacaoSingleResultado from "./AvaliacaoSingleResultado";
import { AvaliacaoDocenteAluno, AvaliacaoDocenteGestor } from "../interface";

export interface SingleAvaliacaoProps {
  role: UserRole;
  avaliacaoAluno?: AvaliacaoDocenteAluno,
  avaliacao?: AvaliacaoDocenteGestor
  };

export async function AvaliacaoSingleRenderer({ role, avaliacaoAluno, avaliacao }: SingleAvaliacaoProps) {
    let relatorio;

  switch (role) {
    case UserRole.ALUNO:
      console.log(avaliacaoAluno)
      if (avaliacaoAluno) return <AvaliacaoSingleAluno avaliacao={avaliacaoAluno} />
      return <p>Erro ao montar formulário para resposta do aluno</p>

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