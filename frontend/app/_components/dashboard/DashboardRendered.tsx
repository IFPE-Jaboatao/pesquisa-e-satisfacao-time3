import { UserRole } from "@/app/types/UserRole.enum";
import { AdminDashboard } from "./AdminDashboard";
import { DocenteDashboard } from "./DocenteDashboard";
import { AlunoDashboard } from "./AlunoDashboard";
import { GestorDashboard } from "./GestorDashboard";

interface Props {
  role: UserRole;
  data: any;
}

export function DashboardRenderer({ role, data }: Props) {
    console.log(role)
  switch (role) {
    case UserRole.ADMIN:
      return <AdminDashboard data={data} />;

    case UserRole.DOCENTE:
      return <DocenteDashboard data={data} />;

    case UserRole.ALUNO:
      return <AlunoDashboard data={data} />;

    case UserRole.GESTOR:
      return <GestorDashboard data={data} />;

    default:
      return (
        <div>
          Perfil não reconhecido.
        </div>
      );
  }
}