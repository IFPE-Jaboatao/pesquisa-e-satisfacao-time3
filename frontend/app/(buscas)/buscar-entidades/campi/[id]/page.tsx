
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getCampusFull } from "@/services/campus.service";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import CampusRenderer from "@/app/_components/buscas/entidades/renderers/CampusRenderer";

interface CampusDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Campus({ params }: CampusDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const campus = await getCampusFull({id: Number(id)});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!campus ? <p>Campus não encontrado...</p> :
                <CampusRenderer campus={campus} selfCampus={campus.id === admin.campusId} />
                }
            </div>
        </div>
    )
}