"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation"; // Importação necessária
import { Campus } from "../../buscas/entidades/interfaces"; 
import { Button, Label } from "flowbite-react";

interface ActionState {
  error: string;
  success: boolean;
  message: string;
}

interface Props {
  campi: Campus[];
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function CreateSetorForm({ campi, action }: Props) {
  const router = useRouter(); // Inicializa o hook de navegação
  const [state, formAction, pending] = useActionState(action, { 
      error: '', 
      success: false, 
      message: '' 
  });

  const basicInput = "border rounded-sm p-0.5 pl-1 text-sm";

  return (
      <div className="flex flex-col max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>
        <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Setor</h2>
        <hr></hr>

        <form action={formAction} className="p-5 flex flex-col gap-1">

             <Label style={{ color: 'var(--dark-color)'}}>Nome</Label>
             <input 
               type="text" 
               name="nome" 
               required 
               className={basicInput}
             />

          <Label style={{ color: 'var(--dark-color)'}}>Campus</Label>
            <select 
              name="campusId" 
              required 
              className={`${basicInput} focus:ring-1 focus:ring-green-700`}
            >
              <option value="">Selecione um campus</option>
              {campi.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

          <div className="flex-1 gap-10 flex mt-5 justify-around">
            {/* Botão Cancelar agora com funcionalidade de retorno */}
            <Button 
              type="button" 
              onClick={() => router.back()}
              style={{ backgroundColor: 'var(--grayish-color)'}}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={pending}
              style={{ backgroundColor: 'var(--color-tertiary)'}}
            >
              {pending ? 'Salvando...' : 'Criar'}
            </Button>
          </div>

          {state?.error && <p className="text-red-600 text-sm text-center">{state.error}</p>}
          {state?.success && <p className="text-green-600 text-sm text-center">{state.message}</p>}
        </form>
      </div>
  );
}