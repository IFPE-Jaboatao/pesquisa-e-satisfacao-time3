
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getCampi } from "@/services/campus.service";
import { getCursoFull } from "@/services/curso.service";
import CursoRenderer from "@/app/_components/buscas/entidades/renderers/CursoRenderer";

interface CursoDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Curso({ params }: CursoDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const curso = await getCursoFull({id: Number(id)});

    // passa campi para caso o usuário tente editar o curso
    const campi = await getCampi();
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!curso ? <p>Curso não encontrado...</p> :
                <CursoRenderer curso={curso} campi={campi} />
                }
            </div>
        </div>
    )
}