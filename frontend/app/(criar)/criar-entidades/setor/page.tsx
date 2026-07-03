import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import { getCampiAction } from '@/actions/campi';
import { createSetorAction } from '@/actions/setores';
import Header from '@/app/_components/Header';
import CreateSetorForm from '@/app/_components/criar/institutional/CreateSetorForm';

export default async function Page() {
  // 1. Guardião: Autenticação e RBAC
  const user = await getMe();
  
  if (!user) redirect('/login');
  
  // Ajuste de segurança: validando role
  if (user.role !== 'admin') redirect('/unauthorized');

  // 2. Data Fetching: Busca dependências em paralelo
  const campi = await getCampiAction();

  // 3. Injeção de Dependências: Passamos os dados do user e a action
  // Agora passamos as props exigidas pelo novo CreateSetorForm para o Header interno
  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header role={user.role} nome={user.nome} index={0} />

      <div className="m-5 flex justify-center flex-row flex-1">
        <CreateSetorForm 
          campi={campi} 
          action={createSetorAction}
        />
      </div>

    </div>
  );
}