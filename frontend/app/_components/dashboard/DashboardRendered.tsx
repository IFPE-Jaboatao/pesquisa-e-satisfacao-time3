import { UserRole } from "@/app/types/UserRole.enum";
import { AdminDashboard, DashboardAdmin } from "./AdminDashboard";
import { DashboardDocente, DocenteDashboard } from "./DocenteDashboard";
import { AlunoDashboard, DashboardAluno } from "./AlunoDashboard";
import { DashboardGestor, GestorDashboard } from "./GestorDashboard";

interface Props {
  role: UserRole;
  dashAluno?: DashboardAluno,
  dashGestor?: DashboardGestor,
  dashDocente?: DashboardDocente,
  dashAdmin?: DashboardAdmin,
}


export function DashboardRenderer({ role, dashAluno, dashGestor, dashDocente, dashAdmin }: Props) {

  switch (role) {
    case UserRole.ADMIN:
      return <AdminDashboard data={dashAdmin} />;

    case UserRole.DOCENTE:
      return <DocenteDashboard data={dashDocente} />;

    case UserRole.ALUNO:
      return <AlunoDashboard data={dashAluno} />;

    case UserRole.GESTOR:
      return <GestorDashboard data={dashGestor} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}