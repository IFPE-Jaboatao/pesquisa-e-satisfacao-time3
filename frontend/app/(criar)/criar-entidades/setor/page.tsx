
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import CreateSetorForm from "@/app/_components/criar/entidades/CreateSetorForm";
import { getCampi } from "@/services/campus.service";


export default async function Setor() {
    const user = await getMe();

    if (!user) {
        redirect('/login')
    }

    if (user.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const campi = await getCampi();

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={user.nome} role={user.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                <CreateSetorForm campi={campi} />
            </div>
        </div>
    )
}