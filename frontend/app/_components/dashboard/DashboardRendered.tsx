import { UserRole } from "@/app/types/UserRole.enum";
import { AdminDashboard, DashboardAdmin } from "./AdminDashboard";
import { DashboardDocente, DocenteDashboard } from "./DocenteDashboard";
import { AlunoDashboard, DashboardAluno } from "./AlunoDashboard";
import { DashboardGestor, GestorDashboard } from "./GestorDashboard";

interface Props {
  role: UserRole;
  data: {
    dashAluno?: DashboardAluno,
    dashGestor?: DashboardGestor,
    dashDocente?: DashboardDocente,
    dashAdmin?: DashboardAdmin,
  };
}


export function DashboardRenderer({ role, data }: Props) {

  switch (role) {
    case UserRole.ADMIN:
      return <AdminDashboard data={data.dashAdmin} />;

    case UserRole.DOCENTE:
      return <DocenteDashboard data={data.dashDocente} />;

    case UserRole.ALUNO:
      return <AlunoDashboard data={data.dashAluno} />;

    case UserRole.GESTOR:
      return <GestorDashboard data={data.dashGestor} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}