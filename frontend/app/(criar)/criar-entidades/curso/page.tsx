import { redirect } from 'next/navigation';
import { getMe } from '@/lib/session';
import { getCampiAction } from '@/actions/campi';
import CreateCursoForm from "@/app/_components/buscas/entidades/forms/academic/CreateCursoForm";

export default async function Page() {
  const user = await getMe();
  
  if (!user || user.role !== 'admin') redirect('/login');

  const campiResult = await getCampiAction();
  const campi = Array.isArray(campiResult) ? campiResult : [];

  return <CreateCursoForm campi={campi} />;
}