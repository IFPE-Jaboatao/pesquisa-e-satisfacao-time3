import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import { getSetoresAction } from '@/actions/setores';
import { getCampiAction } from '@/actions/campi';
import { createServicoAction } from '@/actions/servicos';
import CreateServicoForm from "@/app/_components/buscas/entidades/forms/CreateServicoForm";

export default async function Page() {
  // 1. Guardião: Autenticação e RBAC
  const user = await getMe();
  
  if (!user) redirect('/login');
  
  // Regra de acesso: Apenas ADMIN pode gerenciar Institucional
  if (user.role !== 'admin') redirect('/unauthorized');

  // 2. Data Fetching: Busca em paralelo para maior performance
  // Se as actions retornarem null/undefined em caso de erro, garantimos arrays vazios
  const [setoresResult, campiResult] = await Promise.all([
    getSetoresAction(),
    getCampiAction()
  ]);

  const setores = Array.isArray(setoresResult) ? setoresResult : [];
  const campi = Array.isArray(campiResult) ? campiResult : [];

  // 3. Injeção de Dependências
  return (
    <CreateServicoForm 
      campi={campi}
      setores={setores} 
      action={createServicoAction}
      userRole={user.role}
      userName={user.nome}
      userId={user.campusId}
    />
  );
}