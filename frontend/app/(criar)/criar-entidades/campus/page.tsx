
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import CreateCampusForm from "@/app/_components/criar/entidades/CreateCampusForm";


export default async function Campus() {
    const user = await getMe();

    if (!user) {
        redirect('/login')
    }

    if (user.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={user.nome} role={user.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                <CreateCampusForm />
            </div>
        </div>
    )
}