import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import { getCampiAction } from '@/actions/campi';
import CreateCursoForm from "@/app/_components/criar/entidades/CreateCursoForm";
import Header from '@/app/_components/Header';

export default async function Page() {
  const user = await getMe();
  
  // Verifica se o usuário está logado e tem permissão
  if (!user || user.role !== 'admin') redirect('/login');

  // Busca os campi necessários para o select
  const campiResult = await getCampiAction();
  const campi = Array.isArray(campiResult) ? campiResult : [];

  // Passa os dados do usuário para o formulário (requisito do Header)
  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>

      <Header index={0} nome={user.nome} role={user.role} />

      <div className="m-5 flex justify-center flex-row flex-1">
        <CreateCursoForm 
          campi={campi}
        />
      </div>
      
    </div>
  );
}