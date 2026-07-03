"use client";

import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Campus } from "../../buscas/entidades/interfaces";
import { createCursoAction } from "@/actions/cursos";

interface Props {
  campi: Campus[];

}

export default function CreateCursoForm({ campi }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCursoAction, { 
      error: '', 
      success: false, 
      message: '' 
  });

  const basicInput = "border rounded-sm p-0.5 pl-1 text-sm";

  return (
      <div className="flex flex-col max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>
        <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Curso</h2>
        <hr></hr>
        
        <form action={formAction} className="p-5 flex flex-col gap-1">
          {/* Campo Nome */}
            <Label style={{ color: 'var(--dark-color)' }} className="w-full">Nome</Label>
            <input 
              type="text" 
              name="nome" 
              required 
              style={{borderColor: 'var(--grayish-color)'}}
              className={basicInput}
            />

          {/* Campo Campus */}
            <Label style={{ color: 'var(--dark-color)' }} className="w-full">Campus</Label>
            <select 
              name="campusId" 
              required 
              style={{borderColor: 'var(--grayish-color)'}}
              className={basicInput}
            >
              <option value="">Selecione um campus</option>
              {campi.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

          {/* Botões de Ação */}
          <div className="flex-1 gap-10 flex mt-5 justify-around">
            <Button style={{ backgroundColor: 'var(--grayish-color)' }} onClick={() => router.back()}>Cancelar</Button>
            <Button 
              style={{ backgroundColor: 'var(--color-tertiary)' }} 
              type="submit" 
              disabled={pending}
            >
              {pending ? 'Criando...' : 'Criar'}
            </Button>
          </div>

          {/* Mensagens de Feedback */}
          {state?.error && <p className="text-red-600 text-center text-sm mt-2 font-semibold">{state.error}</p>}
          {state?.success && <p className="text-green-600 text-center text-sm mt-2 font-semibold">{state.message}</p>}
        </form>
      </div>
  );
}