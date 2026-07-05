import { PesquisaSingleRenderer } from "@/app/_components/buscas/pesquisa-satisfacao/single/PesquisaSingleRenderer";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";

import { getPesquisaCompleta } from "@/services/pesquisas.service"; 
import { getMe } from "@/services/user.service";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

interface PesquisaDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Pesquisa({ params}: PesquisaDetalheProps) {
  const { id } = await params;

  const user = await getMe();

  if (!user) redirect('/login')

  if (user.role === UserRole.DOCENTE || user.role === UserRole.ADMIN) redirect ('/unauthorized')

  const dadosDaPesquisa = (await getPesquisaCompleta({ id }));

  if (dadosDaPesquisa === false) {
    redirect("/login");
  }

  if (!dadosDaPesquisa) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold bg-white rounded-lg shadow m-6">
        Nenhum dado encontrado para a pesquisa {id}.
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header role={user.role} index={0} nome={user.nome} />
      
      <div className="flex justify-center flex-row flex-1">
      
          {!dadosDaPesquisa 
            ? <div className="rounded p-2 mt-5 self-start flex flex-col items-center h-30 justify-center" style={{backgroundColor: 'var(--white)'}}>
              <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>A pesquisa não foi encontrada...</p>
              <FaceFrownIcon className="h-15" style={{color: 'var(--grayish-color)'}} />
            </div>
            
            : user.role == UserRole.ALUNO ? <PesquisaSingleRenderer role={user.role} pesquisaAluno={dadosDaPesquisa} />
            : <PesquisaSingleRenderer role={user.role} pesquisaGestor={dadosDaPesquisa} />
            }
      </div>
    </div>
  )

}