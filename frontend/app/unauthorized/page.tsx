// src/app/profile/page.js
import { redirect } from 'next/navigation';
import Header from '../_components/Header';
import { getMe } from '@/services/user.service';

export default async function Unauthorized() {
  const user = await getMe();    

  if (!user) {
    redirect('/login');
  }

  return (
    <div className='flex flex-1 flex-col' style={{backgroundColor: 'var(--light-color)'}}>
      <Header nome={user.nome} role={user.role} index={1} />

      <div className='flex-1 justify-center flex flex-col' style={{ backgroundColor: 'var(--dark-color'}}>
        <p className='text-center font-semibold' style={{color: 'var(--white)'}}>Você não tem acesso a essa página...</p>
      </div>
    </div>
  );
}

