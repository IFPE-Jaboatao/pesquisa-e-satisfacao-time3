import { UserRole } from "@/app/types/UserRole.enum";
import { SatisfacaoAluno } from "./SatisfacaoAluno";
import { SatisfacaoGestor } from "./SatisfacaoGestor";
import { PesquisaSatisfacaoAluno, PesquisaSatisfacaoGestor } from "./interface";


interface Props {
  role: UserRole;
  satisfacoesAluno?: {
    satisfacoes: PesquisaSatisfacaoAluno[],
  },
  satisfacoesGestor?: {
    satisfacoes: {
      ativas?: PesquisaSatisfacaoGestor[],
    inativas?: PesquisaSatisfacaoGestor[],
    fechadas?: PesquisaSatisfacaoGestor[]
    }
    }
  };

export function SatisfacaoRenderer({ role, satisfacoesAluno, satisfacoesGestor }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <SatisfacaoAluno satisfacoes={satisfacoesAluno} />;

    case UserRole.GESTOR:
      return <SatisfacaoGestor satisfacoes={satisfacoesGestor} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}