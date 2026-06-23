import UsuarioForm from "@/app/_components/buscas/usuarios/UsuarioForm";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getCampi } from "@/services/campus.service";
import { getMe, getUser } from "@/services/user.service"
import { redirect } from "next/navigation";

interface UsuarioDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Usuario({ params }: UsuarioDetalheProps) {
    const { id } = await params;
    
    const admin = await getMe();

    if (!admin) {
        redirect('/login')
    }

    if (admin.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const user = await getUser({id: Number(id)})

    const campi = await getCampi();
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div className="m-5 flex justify-center flex-row">
            {!user ? (
                <div>Usuário não encontrado.</div>
            ) : (
                <UsuarioForm user={user} campi={campi} selfEdit={admin.id === user.id} />
            )}
            </div>
        </div>
    )
}