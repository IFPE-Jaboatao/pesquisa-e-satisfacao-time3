"use client";

import { alterarSenhaAction } from "@/actions/alterar-senha";
import { Button, Label } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function AlterarSenhaForm() {
    const [state, formAction, pending] = useActionState(alterarSenhaAction, { error: '', success: false});

    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaNova, setSenhaNova] = useState('');
    const [senhaNovaConfirmada, setSenhaNovaConfirmada] = useState('');
    const [redictMessageVisible, setRedirectMessageVisible] = useState(false);

    const senhasDiferentes = senhaNovaConfirmada.length > 0 && senhaNova !== senhaNovaConfirmada;

    const goBack = () => {
        redirect('/home/profile')
    }

    useEffect(() => {
        if (state.success) {
            setSenhaNova('');
            setSenhaAtual('');
            setSenhaNovaConfirmada('');
            setRedirectMessageVisible(true);

            const timer = setTimeout(() => {
                redirect('/home/profile');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state.success])

    const handleSubmit = async (formData: FormData) => {
        await formAction(formData)
    }

  return (
    <div className="p-2 mr-10 ml-10 max-sm:mr-2 max-sm:ml-2 max-h-max max-w-max rounded-sm flex flex-col bg-white">

        <form action={handleSubmit} className="p-5 max-sm:p-2 flex flex-col gap-1">

        <Label style={{ color: 'var(--dark-color)'}}>Senha Atual</Label>
            <input
                type="password"
                name="senhaAtual"
                required
                className="border rounded-sm p-0.5 pl-1 text-sm"
                style={{ borderColor: `${state?.error && !redictMessageVisible ? 'var(--error)' : 'var(--grayish-color)'}`}}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
            />

        <Label style={{ color: 'var(--dark-color)'}}>Senha Nova</Label>
            <input
                type="password"
                name="senhaNova"
                minLength={6}
                required
                className="border rounded-sm p-0.5 pl-1 text-sm"
                style={{ borderColor: `${senhasDiferentes && !redictMessageVisible ? 'var(--error)' : 'var(--grayish-color)'}`}}
                value={senhaNova}
                onChange={(e) => setSenhaNova(e.target.value)}
            />

        <Label style={{ color: 'var(--dark-color)'}}>Confirmar Senha Nova</Label>
            <input
                type="password"
                name="senhaNovaConfirmada"
                minLength={6}
                required
                className="border rounded-sm p-0.5 pl-1 text-sm"
                style={{ borderColor: `${senhasDiferentes && !redictMessageVisible ? 'var(--error)' : 'var(--grayish-color)'}`}}
                value={senhaNovaConfirmada}
                onChange={(e) => setSenhaNovaConfirmada(e.target.value)}
            />

        <div className="flex-1 gap-10 max-sm:gap-5 flex max-sm:flex-col-reverse mt-5 max-sm:mt-5 justify-around">

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
            disabled={senhasDiferentes || pending || redictMessageVisible}
            type="submit">
                {pending ? 'Alterando...' : 'Alterar Senha'}
            </Button>

        </div>

            <div className="mt-2 flex flex-col gap-2 items-center">
                {state?.error && !redictMessageVisible && <p style={{ color: 'var(--error)'}}>⚠️ {state.error}</p>}

                {senhasDiferentes && !redictMessageVisible ? <p style={{ color: 'var(--error)'}}>⚠️ Senhas não coincidem!</p> : ''}

                {state?.success && state?.error === '' ? <p className="font-semibold" style={{ color: 'var(--color-secondary)'}}>Alteração concluída!</p> : ''}
                {redictMessageVisible ? <p className="text-center" style={{ color: 'var(--color-secondary)'}}>Redirecionando você para a página anterior...</p> : ''}

            </div>

        </form>

    </div>
  );
}