
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getDocentesByCampus, getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getDisciplinaByCurso } from "@/services/disciplina.service";
import { getTurma } from "@/services/turma.service";
import { getPeriodos } from "@/services/periodo.service";
import TurmaRenderer from "@/app/_components/buscas/entidades/renderers/TurmaRenderer";

interface TurmaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Turma({ params }: TurmaDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const turma = await getTurma({id: Number(id)});

    // passa disciplinas para caso o usuário tente editar a turma
    const disciplinas = await getDisciplinaByCurso({cursoId: turma.disciplina?.curso?.id});

    // passa os períodos para caso o usuário tente editar a turma
    const periodos = await getPeriodos();

    // passa os docentes do campus para caso o usuário tente editar a turma
    const docentes = await getDocentesByCampus({id: turma.campus?.id});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!turma ? <p>Turma não encontrada...</p> :
                <TurmaRenderer turma={turma} disciplinas={disciplinas} periodos={periodos} docentes={docentes} />
                }
            </div>
        </div>
    )
}