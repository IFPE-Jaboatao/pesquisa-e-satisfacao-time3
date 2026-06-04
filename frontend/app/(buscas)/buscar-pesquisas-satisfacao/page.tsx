import { SatisfacaoRenderer } from "@/app/_components/buscas/SatisfacaoRenderer";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getDashboard } from "@/services/dashboard.service";
import { getMe } from "@/services/user.service";
import { Roboto_Flex } from "next/font/google";
import { redirect } from "next/navigation";

export default async function BuscarPesquisasSatisfacao() {
  const user = await getMe();    

  if (!user) {
    redirect('/login');
  }

  if (user.role === UserRole.ADMIN || user.role === UserRole.DOCENTE) {
    redirect('/unauthorized')
  }

  const dashboardData = await getDashboard(user.role);

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header nome={user.nome} role={user.role} index={0} />

      <div className='flex-1 justify-center flex flex-col m-2'>
        <SatisfacaoRenderer data={dashboardData} role={user.role}  />
      </div>
    </div>
  )
}