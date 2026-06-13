import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoAluno from "./AvaliacaoAluno";
import AvaliacaoGestor from "./AvaliacaoGestor";
import AvaliacaoDocente from "./AvaliacaoDocente";
import { AvaliacaoDocenteAluno, AvaliacaoDocenteDocente, AvaliacaoDocenteGestor } from "./interface";

interface Props {
  role: UserRole;
  data: {
    avaliacoesAluno?: AvaliacaoDocenteAluno[],
    avaliacoesGestor?: {
      ativas?: AvaliacaoDocenteGestor[],
      inativas?: AvaliacaoDocenteGestor[],
      fechadas?: AvaliacaoDocenteGestor[],
    }
    avaliacoesDocente?: {
      ativas?: AvaliacaoDocenteDocente[],
      inativas?: AvaliacaoDocenteDocente[],
      fechadas?: AvaliacaoDocenteDocente[],
    }
  };
}

export function AvaliacaoRenderer({ role, data }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <AvaliacaoAluno avaliacoes={data.avaliacoesAluno} />;

    case UserRole.GESTOR:
      return <AvaliacaoGestor avaliacoes={data.avaliacoesGestor} />;

    case UserRole.DOCENTE:
      return <AvaliacaoDocente avaliacoes={data.avaliacoesDocente} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}