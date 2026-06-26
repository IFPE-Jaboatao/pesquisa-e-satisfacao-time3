"use client";

import { Button, Label } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { Campus } from "../../buscas/entidades/interfaces";
import { createSetorAction } from "@/actions/setores";

interface Props {
    campi: Campus[]
}

export default function CreateSetorForm({ campi }: Props) {
    const [state, formAction, pending] = useActionState(createSetorAction, { error: "", success: false, message: '' });

    const goBack = () => {
        redirect('/criar-entidades')
    }

  return (
    <div className="flex flex-col max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>

        <div>
            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Campus</h2>
            <hr></hr>
        </div>
    
        <form action={formAction} className="p-5 flex flex-col gap-1">

        <Label style={{ color: 'var(--dark-color)'}}>Nome do Setor</Label>
        <input
            type="text"
            name="nome"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
        />

        <Label style={{ color: 'var(--dark-color)'}}>Campus</Label>
        <select
        name="campusId"
        className="border rounded-sm p-0.5 pl-1 text-sm"
        style={{ borderColor: 'var(--grayish-color)'}}
            >        
            {campi.map((c: Campus) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
            </select>

        <div className="flex-1 gap-10 flex mt-5 justify-around">

            <Button
            style={{ backgroundColor: 'var(--grayish-color)'}}
            type="button"
            disabled={pending}
            onClick={goBack}
            >
                Cancelar
            </Button>

            <Button
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            type="submit">
                {pending ? 'Criando...' : 'Criar'}
            </Button>

        </div>

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        {state?.success && <p style={{color: 'var(--color-secondary)'}} className="text-center mt-5 font-semibold">Setor criado!</p>}

        </form>
    </div>
  );
}