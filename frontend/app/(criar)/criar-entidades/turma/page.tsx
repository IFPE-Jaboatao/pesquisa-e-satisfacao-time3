
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getMe } from "@/services/user.service"
import { redirect } from "next/navigation";
import CreateDisciplinaForm from "@/app/_components/criar/academic/CreateDisciplinaForm";
import { getCursos } from "@/services/curso.service";
import { getDashboard } from "@/services/dashboard.service";
import { XCircleIcon } from "@heroicons/react/16/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import BasicButton from "@/app/_components/BasicButton";
import { Button } from "flowbite-react";
import Link from "next/link";
import CreateTurmaForm from "@/app/_components/criar/academic/CreateTurmaForm";

export default async function Turma() {
    const user = await getMe();

    if (!user) {
        redirect('/login')
    }

    if (user.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const dashboardData = await getDashboard(user.role);

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
            <Header index={0} nome={user.nome} role={user.role} />
            <div className="m-5 flex justify-center flex-row flex-1">
                {
                    dashboardData.error && dashboardData.error !== '' ?
                        <div className="flex flex-col bg-white self-start p-5 rounded shadow-xs">
                            <h2 style={{ color: 'var(--color-primary)'}} className='self-start font-bold text-2xl p-1'>Criar Turma</h2>
                            <hr></hr>

                            <div className="flex flex-col gap-3 items-center mt-5">
                                <XCircleIcon height={100} width={100} style={{ color: "var(--error)"}} />
                                <h6 className="font-bold text-xl" style={{ color: "var(--error)"}}>Erro!</h6>
                                <p className="font-semibold" style={{ color: "var(--grayish-color)"}}>{dashboardData.error}</p>
                                <Link href='/criar-entidades'>
                                    <Button className="border cursor-pointer" style={{ backgroundColor: 'var(--white)', color: 'var(--grayish-color', borderColor: 'var(--light-color)'}}>Voltar</Button>
                                </Link>
                            </div>
                        </div>
                    :
                    <div>
                        <CreateTurmaForm
                            academic={dashboardData.academic}
                            institutional={dashboardData.institutional}
                            users={dashboardData.users}
                        />
                    </div>
                }
            </div>
        </div>
    )
}