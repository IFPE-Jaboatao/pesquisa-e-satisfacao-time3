import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoAluno from "./AvaliacaoAluno";
import AvaliacaoGestor from "./AvaliacaoGestor";
import AvaliacaoDocente from "./AvaliacaoDocente";
import { AvaliacaoDocenteAluno, AvaliacaoDocenteDocente, AvaliacaoDocenteGestor } from "./interface";

interface Props {
  role: UserRole;
  avaliacoesAluno?: {
    avaliacoes: AvaliacaoDocenteAluno[],
  }
  avaliacoesGestor?: {
    avaliacoes: {
      ativas?: AvaliacaoDocenteGestor[],
    inativas?: AvaliacaoDocenteGestor[],
    fechadas?: AvaliacaoDocenteGestor[],
    }
    }
  avaliacoesDocente?: {
      avaliacoes: {
        avaliacoes: {
          ativas?: AvaliacaoDocenteDocente[],
        inativas?: AvaliacaoDocenteDocente[],
        fechadas?: AvaliacaoDocenteDocente[],
        }
      }
    }
  };

export function AvaliacaoRenderer({ role, avaliacoesAluno, avaliacoesGestor, avaliacoesDocente }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <AvaliacaoAluno avaliacoes={avaliacoesAluno} />;

    case UserRole.GESTOR:
      return <AvaliacaoGestor avaliacoes={avaliacoesGestor} />;

    case UserRole.DOCENTE:
      return <AvaliacaoDocente avaliacoes={avaliacoesDocente} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}