import { AvaliacaoSingleRenderer } from "@/app/_components/buscas/avaliacao-docente/single/AvaliacaoSingleRenderer";
import Header from "@/app/_components/Header";
import { UserRole } from "@/app/types/UserRole.enum";
import { getPesquisaCompleta } from "@/services/pesquisas.service";
import { getMe } from "@/services/user.service";
import { FaceFrownIcon } from "@heroicons/react/16/solid";
import { redirect } from "next/navigation";

interface AvaliacaoDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function Avaliacao({ params }: AvaliacaoDetalheProps) {
// espera pegar o id no parâmetro da URL
  const { id } = await params;

  const user = await getMe();

  if (!user) {
      redirect('/login')
  }

  if (user.role === UserRole.ADMIN) {
      redirect('/unauthorized')
  }

  const dadosDaPesquisa = await getPesquisaCompleta({id});

    return (
        <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
          <Header index={0} nome={user.nome} role={user.role} />

          <div className="flex justify-center flex-row flex-1">

          {!dadosDaPesquisa 
            ? <div className="rounded p-2 mt-5 self-start flex flex-col items-center h-30 justify-center" style={{backgroundColor: 'var(--white)'}}>
              <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>A pesquisa não foi encontrada...</p>
              <FaceFrownIcon className="h-15" style={{color: 'var(--grayish-color)'}} />
            </div>
            
            : user.role == UserRole.ALUNO ? <AvaliacaoSingleRenderer role={user.role} avaliacaoAluno={dadosDaPesquisa} />
            : <AvaliacaoSingleRenderer role={user.role} avaliacao={dadosDaPesquisa} />
            }

          </div>


        </div>
    )
} 