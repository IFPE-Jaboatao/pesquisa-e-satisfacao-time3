// src/app/profile/page.js
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Header from '../_components/Header';
import LogoutButton from '../_components/LogoutButton';
import { getMe } from '@/services/user.service';
import { getDashboard } from '@/services/dashboard.service';
import { DashboardRenderer } from '../_components/dashboard/DashboardRendered';

export default async function HomePage() {
  const user = await getMe();    

  if (!user) {
    redirect('/login');
  }

  const dashboardData = await getDashboard(user.role);
  console.log(dashboardData)

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header nome={user.nome} role={user.role} index={1} />

      <div className='flex-1 justify-center flex flex-col'>
        <DashboardRenderer role={user.role} data={dashboardData} />

      </div>
    </div>
  );
}

