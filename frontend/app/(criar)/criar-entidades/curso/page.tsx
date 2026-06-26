import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import { getCampiAction } from '@/actions/campi';
import CreateCursoForm from "@/app/_components/buscas/entidades/forms/academic/CreateCursoForm";

export default async function Page() {
  const user = await getMe();
  
  // Verifica se o usuário está logado e tem permissão
  if (!user || user.role !== 'admin') redirect('/login');

  // Busca os campi necessários para o select
  const campiResult = await getCampiAction();
  const campi = Array.isArray(campiResult) ? campiResult : [];

  // Passa os dados do usuário para o formulário (requisito do Header)
  return (
    <CreateCursoForm 
      campi={campi}
      userRole={user.role}
      userName={user.nome}
      userId={user.campusId} 
    />
  );
}