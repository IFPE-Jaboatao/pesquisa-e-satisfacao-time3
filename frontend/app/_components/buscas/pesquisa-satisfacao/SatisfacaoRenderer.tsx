import { UserRole } from "@/app/types/UserRole.enum";
import { SatisfacaoAluno } from "./SatisfacaoAluno";
import { SatisfacaoGestor } from "./SatisfacaoGestor";
import { PesquisaSatisfacaoAluno, PesquisaSatisfacaoGestor } from "./interface";


interface Props {
  role: UserRole;
  data: {
    satisfacoesAluno?: PesquisaSatisfacaoAluno[],
    satisfacoesGestor?: {
      ativas?: PesquisaSatisfacaoGestor[],
      inativas?: PesquisaSatisfacaoGestor[],
      fechadas?: PesquisaSatisfacaoGestor[]
    }
  };
}

export function SatisfacaoRenderer({ role, data }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <SatisfacaoAluno satisfacoes={data.satisfacoesAluno || []} />;

    case UserRole.GESTOR:
      return <SatisfacaoGestor satisfacoes={data.satisfacoesGestor} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}