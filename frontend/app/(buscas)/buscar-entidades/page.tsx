import EntidadesAdmin from "@/app/_components/buscas/entidades/EntidadesAdmin";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getDashboard } from "@/services/dashboard.service";
import { getMe } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function BuscarEntidades() {
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

            <EntidadesAdmin data={dashboardData} />
        </div>
    )
}