import UsuariosAdmin from "@/app/_components/buscas/UsuariosAdmin";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getDashboard } from "@/services/dashboard.service";
import { getMe } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function BuscarUsuarios() {
    const user = await getMe();    

    if (!user) {
        redirect('/login');
    }

    if (user.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const dashboardData = await getDashboard(user.role);

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={user.nome} role={user.role} />

            <UsuariosAdmin data={dashboardData.users} />
        </div>
    )
}