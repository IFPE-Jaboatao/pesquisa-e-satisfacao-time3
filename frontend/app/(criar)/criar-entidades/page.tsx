import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import Header from "../../_components/Header";
import EntidadesMenu from "../../_components/buscas/entidades/EntidadesMenuContent";

export default async function CriarEntidadesPage() {
  // 1. Guardião: Autenticação e RBAC
  const user = await getMe();
  
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/unauthorized');

  // 2. Renderização
  // Ajustado para usar 'nome' e 'campusId' conforme o erro apontou
  return (
    <>
      <Header 
        role={user.role} 
        nome={user.nome} 
        index={user.campusId} 
      />
      <EntidadesMenu />
    </>
  );
}