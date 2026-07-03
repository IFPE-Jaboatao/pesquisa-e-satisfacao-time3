"use client";

import { createCampusAction } from "@/actions/campi";
import { Button, Label } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { cidades } from "../../buscas/entidades/forms/institutional/CampusForm";

export default function CreateCampusForm() {
    const [state, formAction, pending] = useActionState(createCampusAction, { error: "", success: false, message: '' });

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

        <Label style={{ color: 'var(--dark-color)'}}>Nome do Campus</Label>
        <input
            type="text"
            name="nome"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
        />

        <Label style={{ color: 'var(--dark-color)'}}>Cidade</Label>
        <select
        name="cidade"
        className="border rounded-sm p-0.5 pl-1 text-sm"
        style={{ borderColor: 'var(--grayish-color)'}}
            >        
            {cidades.map((c) => (
                <option key={c.cidade} value={c.cidade}>
                    {c.cidade}
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

        {state?.success && <p style={{color: 'var(--color-secondary)'}} className="text-center mt-5 font-semibold">Campus criado!</p>}

        </form>
    </div>
  );
}