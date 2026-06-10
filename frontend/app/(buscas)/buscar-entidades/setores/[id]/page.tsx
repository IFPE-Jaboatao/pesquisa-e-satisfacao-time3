
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getSetorFull } from "@/services/setor.service";
import SetorRenderer from "@/app/_components/buscas/entidades/renderers/SetorRenderer";
import { getCampi } from "@/services/campus.service";

interface SetorDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Setor({ params }: SetorDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const setor = await getSetorFull({id: Number(id)});

    // passa campi para caso o usuário tente editar o campus
    const campi = await getCampi();
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!setor ? <p>Setor não encontrado...</p> :
                <SetorRenderer setor={setor} campi={campi} />
                }
            </div>
        </div>
    )
}