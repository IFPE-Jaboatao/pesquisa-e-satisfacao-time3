import { UserRole } from "@/app/types/UserRole.enum";
import AvaliacaoAluno from "./AvaliacaoAluno";
import AvaliacaoGestor from "./AvaliacaoGestor";
import AvaliacaoDocente from "./AvaliacaoDocente";

interface Props {
  role: UserRole;
  data: any;
}

export function AvaliacaoRenderer({ role, data }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <AvaliacaoAluno data={data} />;

    case UserRole.GESTOR:
      return <AvaliacaoGestor data={data} />;

    case UserRole.DOCENTE:
      return <AvaliacaoDocente data={data} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}