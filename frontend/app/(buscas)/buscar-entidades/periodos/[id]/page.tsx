
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getPeriodo } from "@/services/periodo.service";
import PeriodoRenderer from "@/app/_components/buscas/entidades/renderers/PeriodoRenderer";

interface PeriodoDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Periodo({ params }: PeriodoDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const periodo = await getPeriodo({id: Number(id)});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!periodo ? <p>Período não encontrado...</p> :
                <PeriodoRenderer periodo={periodo} />
                }
            </div>
        </div>
    )
}