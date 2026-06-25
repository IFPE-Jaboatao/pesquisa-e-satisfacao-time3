// src/app/profile/page.js
import { redirect } from 'next/navigation';
import Header from '@/app/_components/Header';
import InputLabel from '@/app/_components/InputLabel';
import LogoutButton from '@/app/_components/LogoutButton';
import BasicButton from '@/app/_components/BasicButton';
import { getMe } from '@/services/user.service';

export default async function Profile() {
    const user = await getMe();    
    
    if (!user) {
      redirect('/login');
    }

  return (
    <div style={{backgroundImage: "url('/accounts-profile-mobile.png')", backgroundRepeat: 'no-repeat', backgroundSize: 500}}>
        <Header nome={user.nome} role={user.role} index={0} />

      <div className='flex-1 flex-col items-center flex'>

        <div 
            style={{ borderColor: 'var(--grayish-color)'}}
            className="p-2 pb-0 m-10 max-h-max max-w-max rounded-sm flex flex-col bg-white border shadow-2xs">
                <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Informações</h2>
                <hr />

            <div className='flex flex-col gap-5 mr-20 ml-20 mt-5 flex-1'>
                <InputLabel value={user.matricula} disabled={true} label='Matrícula' />

                <InputLabel value={user.nome} disabled={true} label='Nome' />
                
                <InputLabel value={user.email} disabled={true} label='Email' />

                <InputLabel value={user.role.slice(0, 1).toUpperCase() + user.role.slice(1)} disabled={true} label='Perfil' />

                <InputLabel value={user.campus || 'Nenhum'} disabled={true} label='Campus' />
            </div>

            <BasicButton title='Alterar Senha' route='/home/profile/alterar-senha' />

            <hr style={{ color: 'var(--error)'}} />

            <LogoutButton />

          </div>
      </div>
    </div>
  );
}