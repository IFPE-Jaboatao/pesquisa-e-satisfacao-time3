"use client";

import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Campus } from "../../interfaces";
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

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1 max-w-xl mx-auto mt-10 p-5 shadow-sm border border-gray-200">
      <h2 style={{ color: 'var(--color-primary)' }} className='font-bold text-2xl mb-4'>Criar Curso</h2>
      <hr className="mb-6" />
      
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 items-center">
          <Label style={{ color: 'var(--dark-color)' }} className="w-20">Nome:</Label>
          <input type="text" name="nome" required className="border border-gray-300 rounded-sm p-1 text-sm flex-1" />
        </div>

        <div className="flex flex-row gap-2 items-center">
          <Label style={{ color: 'var(--dark-color)' }} className="w-20">Campus:</Label>
          <select name="campusId" required className="border border-gray-300 rounded-sm p-1 text-sm flex-1">
            <option value="">Selecione um campus</option>
            {campi.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button color="gray" onClick={() => router.back()}>Cancelar</Button>
          <Button style={{ backgroundColor: 'var(--color-tertiary)' }} type="submit" disabled={pending}>
            {pending ? 'Criando...' : 'Criar'}
          </Button>
        </div>

        {state?.error && <p className="text-red-600 text-center text-sm mt-2">{state.error}</p>}
        {state?.success && <p className="text-green-600 text-center text-sm mt-2">Curso criado com sucesso!</p>}
      </form>
    </div>
  );
}