import { UserRole } from "@/app/types/UserRole.enum";
import { SatisfacaoAluno } from "./SatisfacaoAluno";
import { SatisfacaoGestor } from "./SatisfacaoGestor";


interface Props {
  role: UserRole;
  data: any;
}

export function SatisfacaoRenderer({ role, data }: Props) {

  switch (role) {
    case UserRole.ALUNO:
      return <SatisfacaoAluno data={data} />;

    case UserRole.GESTOR:
      return <SatisfacaoGestor data={data} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}