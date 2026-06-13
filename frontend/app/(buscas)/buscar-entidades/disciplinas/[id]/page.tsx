
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import SetorRenderer from "@/app/_components/buscas/entidades/renderers/SetorRenderer";
import { getCampi } from "@/services/campus.service";
import { getCursoFull, getCursosByCampus } from "@/services/curso.service";
import CursoRenderer from "@/app/_components/buscas/entidades/renderers/CursoRenderer";
import { getDisciplina } from "@/services/disciplina.service";
import DisciplinaRenderer from "@/app/_components/buscas/entidades/renderers/DisciplinaRenderer";

interface DisciplinaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Disciplina({ params }: DisciplinaDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const disciplina = await getDisciplina({id: Number(id)});

    // passa cursos para caso o usuário tente editar a disciplina
    const cursos = await getCursosByCampus({campusId: disciplina.campusId});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!disciplina ? <p>Disciplina não encontrada...</p> :
                <DisciplinaRenderer disciplina={disciplina} cursos={cursos} />
                }
            </div>
        </div>
    )
}