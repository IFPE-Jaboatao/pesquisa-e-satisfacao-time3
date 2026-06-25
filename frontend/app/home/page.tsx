import { redirect } from 'next/navigation';
import Header from '../_components/Header';
import { getMe } from '@/services/user.service';
import { getDashboard } from '@/services/dashboard.service';
import { DashboardRenderer } from '../_components/dashboard/DashboardRendered';
import { UserRole } from '../types/UserRole.enum';

export default async function HomePage() {
  const user = await getMe();    

  if (!user) {
    redirect('/login');
  }

  const dashboardData = await getDashboard(user.role);

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header nome={user.nome} role={user.role} index={1} />

      <div className='flex-1 justify-center flex flex-col'>
        {user.role == UserRole.ADMIN ? <DashboardRenderer role={user.role} dashAdmin={dashboardData} />
        : user.role == UserRole.GESTOR ? <DashboardRenderer role={user.role} dashGestor={dashboardData} />
        : user.role == UserRole.ALUNO ? <DashboardRenderer role={user.role} dashAluno={dashboardData} />
        : user.role == UserRole.DOCENTE ? <DashboardRenderer role={user.role} dashDocente={dashboardData} />   
        : 'Perfil não conhecido.'
      }
      </div>
    </div>
  );
}

