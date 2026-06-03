import AlterarSenhaForm from "@/app/_components/AlterarSenhaForm";
import BasicButton from "@/app/_components/BasicButton";
import Header from "@/app/_components/Header";
import { getMe } from "@/services/user.service";
import { redirect } from "next/navigation";
import { useState } from "react";

export default async function AlterarSenha() {
    const user = await getMe();    
    
    if (!user) {
        redirect('/login');
    }

    return (
    <div>
        <Header nome={user.nome} role={user.role} index={0} />

      <div className='flex-1 flex-col items-center flex'>

        <div 
            style={{ borderColor: 'var(--grayish-color)'}}
            className="p-2 pb-0 m-10 max-h-max max-w-max rounded-sm flex flex-col bg-white border shadow-2xs">
                <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Alterar Senha</h2>
                <hr />

            <AlterarSenhaForm />

          </div>
      
      </div>
    </div>
    )
}