import { UserRole } from "@/app/types/UserRole.enum";
import PesquisaSingleAluno from "./PesquisaSingleAluno";
import PesquisaSingleGestor from "./PesquisaSingleGestor";
import { getRelatorioPesquisa } from "@/services/pesquisas.service";
import { AvaliacaoDocenteGestor, PesquisaAluno } from "../../avaliacao-docente/interface";

export interface SingleAvaliacaoProps {
  role: UserRole;
  pesquisaAluno?: PesquisaAluno,
  pesquisaGestor?: AvaliacaoDocenteGestor
  };

export async function PesquisaSingleRenderer({ role, pesquisaAluno, pesquisaGestor }: SingleAvaliacaoProps) {
    let relatorio;

  switch (role) {
    case UserRole.ALUNO:
      if (pesquisaAluno) return <PesquisaSingleAluno pesquisa={pesquisaAluno} />;
      else return <p>Erro ao montar formulário de resposta para aluno.</p>

    case UserRole.GESTOR:
        relatorio = await getRelatorioPesquisa({id: pesquisaGestor?.id || '0'});
      return <PesquisaSingleGestor relatorio={relatorio} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}