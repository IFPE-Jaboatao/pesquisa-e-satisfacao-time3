
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getMatricula } from "@/services/matricula.service";
import MatriculaRenderer from "@/app/_components/buscas/entidades/renderers/MatriculaRenderer";

interface MatriculaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Matricula({ params }: MatriculaDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const matricula = await getMatricula({id: Number(id)});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!matricula ? <p>Matrícula não encontrada...</p> :
                <MatriculaRenderer matricula={matricula} />
                }
            </div>
        </div>
    )
}