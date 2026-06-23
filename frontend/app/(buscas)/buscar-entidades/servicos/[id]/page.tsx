
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import { getSetoresByCampus } from "@/services/setor.service";
import { getServico } from "@/services/servico.service";
import ServicoRenderer from "@/app/_components/buscas/entidades/renderers/ServicoRenderer";

interface ServicoDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Servico({ params }: ServicoDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const servico = await getServico({id: Number(id)});

    // passa setores daquele mesmo campus para caso o usuário tente editar o serviço
    const setores = await getSetoresByCampus({campusId: servico.setor.campus.id});
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {!servico ? <p>Serviço não encontrado...</p> :
                <ServicoRenderer servico={servico} setores={setores} />
                }

            </div>
        </div>
    )
}