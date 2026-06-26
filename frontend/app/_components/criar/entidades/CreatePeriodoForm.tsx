"use client";

import { Button, Label } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { createPeriodoAction } from "@/actions/periodos";

export default function CreatePeriodoForm() {
    const [state, formAction, pending] = useActionState(createPeriodoAction, { error: "", success: false, message: '' });

    const goBack = () => {
        redirect('/criar-entidades')
    }

    const basicInput ="border rounded-sm p-0.5 pl-1 text-sm";
    const borderColorInput = 'var(--grayish-color)';

    const now = new Date().getFullYear();

  return (
    <div className="flex flex-col items-stretch max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>

        <div>
            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Período</h2>
            <hr></hr>
        </div>
    
        <form action={formAction} className="p-5 flex flex-col gap-1">

        <Label style={{ color: 'var(--dark-color)'}}>Ano:</Label>
            <input
                type="number"
                name="ano"
                required
                min={2010}
                max={now+1}
                step={1}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />


            <Label style={{ color: 'var(--dark-color)'}}>Semestre:</Label>
            <input
                type="number"
                name="semestre"
                required
                min={1}
                max={2}
                step={1}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />

            <Label style={{ color: 'var(--dark-color)'}}>Início:</Label>
            <input
                type="date"
                name="startDate"
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />

            <Label style={{ color: 'var(--dark-color)'}}>Término:</Label>
            <input
                type="date"
                name="endDate"
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />

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

        {state?.success && <p style={{color: 'var(--color-secondary)'}} className="text-center mt-5 font-semibold">Período criado!</p>}

        </form>
    </div>
  );
}