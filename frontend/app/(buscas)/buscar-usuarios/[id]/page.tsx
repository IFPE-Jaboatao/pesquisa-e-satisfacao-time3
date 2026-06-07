import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
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
    
    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={admin.nome} role={admin.role} />
            <div>
            <p>dados do usuario</p>
            {!user ? (
                <div>Usuário não encontrado.</div>
            ) : (
                <div>
                    <p>{user.nome}</p>
                    <p>{user.email}</p>
                    <p>{user.id}</p>
                    <p>{user.role}</p>
                    <p>{user.campusId}</p>
                    <p>{user.campus}</p>
                </div>
            )}
            </div>
        </div>
    )
}