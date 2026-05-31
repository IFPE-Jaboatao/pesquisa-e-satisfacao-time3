// src/app/profile/page.js
import { redirect } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Header from '../_components/Header';
import LogoutButton from '../_components/LogoutButton';

export default async function HomePage() {
  const res = await apiFetch('/users/me');

  if (res.status === 401) {
    redirect('/login');
  }

  if (!res.ok) {
    throw new Error(`Falha ao carregar perfil: ${res.status}`);
  }

  const user = await res.json();

  return (
    <div>
      <Header nome={user.nome} role={user.role} index={1} />

      <div className='flex-1 justify-center flex'>

        <LogoutButton />

      </div>
    </div>
  );
}

