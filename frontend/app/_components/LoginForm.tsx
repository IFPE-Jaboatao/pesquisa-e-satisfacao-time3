"use client";

import { loginAction } from "@/actions/auth";
import { Button, ButtonGroup, Label, TextInput } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState } from "react";

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(loginAction, { error: "" });

    const goBack = () => {
        redirect('/')
    }

  return (
    <div className="p-2 m-10 max-h-max max-w-max rounded-sm flex flex-col bg-white">

        <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Login</h2>
        <hr></hr>
    
        <form action={formAction} className="p-5 flex flex-col gap-1">


        <Label style={{ color: 'var(--dark-color)'}}>Matrícula</Label>
        <input
            type="text"
            name="matricula"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
        />

        <Label style={{ color: 'var(--dark-color)'}}>Senha</Label>

        <input
            type="password"
            name="password"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
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
                {pending ? 'Entrando…' : 'Entrar'}
            </Button>

        </div>

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}