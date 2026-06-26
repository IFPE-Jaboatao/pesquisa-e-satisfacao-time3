import BuscaTitulo from "@/app/_components/buscas/BuscaTitulo";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getDashboard } from "@/services/dashboard.service";
import { getMe } from "@/services/user.service";
import { IdentificationIcon, AcademicCapIcon } from "@heroicons/react/16/solid";
// import {  } from "@heroicons/react/24/outline";
import { BuildingOffice2Icon, BookOpenIcon, UsersIcon, CalendarDaysIcon, WrenchScrewdriverIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect } from "next/navigation";

;

export default async function HomePage() {
  const user = await getMe();    

    if (!user) {
        redirect('/login');
    }

    if (user.role !== UserRole.ADMIN) {
        redirect('/unauthorized')
    }

    const cardStyle = 'bg-white flex flex-col items-center rounded-xl max-sm:w-50 w-40 shadow-sm hover:shadow-xl max-w-100'
    const cardTitleStyle = 'font-bold text-xl';
    const iconStyle = 'h-50 w-30 max-sm:h-40 max-sm:w-15';

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header nome={user.nome} role={user.role} index={0} />

      <div className='flex-1 flex flex-col'>

        <div className='justify-center flex flex-col max-w-max self-center mb-10 mt-10'>
            <BuscaTitulo title="O que deseja criar?" color="--color-primary" bolder={true} />
            <hr style={{color: 'var(--dark-color)'}}></hr>
        </div>

        <div style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}} className="grid place-items-center gap-5 max-sm:mr-5 max-sm:ml-5 max-md:mr-15 max-md:ml-15 mr-80 ml-80">

            <Link href='/criar-entidades/campus' className={cardStyle}>
                <BuildingOffice2Icon className={iconStyle} />
                <p className={cardTitleStyle}>Campi</p>
            </Link>

                <Link href='/criar-entidades/setor' className={cardStyle}>
                    <Squares2X2Icon className={iconStyle} />
                    <p className={cardTitleStyle}>Setor</p>
                </Link>
            
                    <Link href='/criar-entidades/servico' className={cardStyle}>
                        <WrenchScrewdriverIcon className={iconStyle} />
                        <p className={cardTitleStyle}>Serviço</p>
                    </Link>

                        <Link href='/criar-entidades/periodo' className={cardStyle}>
                            <CalendarDaysIcon className={iconStyle} />
                            <p className={cardTitleStyle}>Período</p>
                        </Link>

            <Link href='/criar-entidades/curso' className={cardStyle}>
                <AcademicCapIcon className={iconStyle} />
                <p className={cardTitleStyle}>Curso</p>
            </Link>

                <Link href='/criar-entidades/disciplina' className={cardStyle}>
                    <BookOpenIcon className={iconStyle} />
                    <p className={cardTitleStyle}>Disciplina</p>
                </Link>
            
                    <Link href='/criar-entidades/turma' className={cardStyle}>
                        <UsersIcon className={iconStyle} />
                        <p className={cardTitleStyle}>Turma</p>
                    </Link>

                        <Link href='/criar-entidades/matricula' className={cardStyle}>
                            <IdentificationIcon className={iconStyle} />
                            <p className={cardTitleStyle}>Matrícula</p>
                        </Link>

            </div>

      </div>
    </div>
  );
}

