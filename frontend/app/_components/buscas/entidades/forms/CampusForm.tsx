"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Campus } from "../interfaces";
import { updateCampusAction } from "@/actions/campi";

interface Props {
    campus: Campus
}

export default function CampusForm({
    campus
    }: Props) {

    const router = useRouter();
    
    // // adiciona campusId a updateCampusAction
    const updateCampusWithId = updateCampusAction.bind(null, campus.id);

    const [state, formAction, pending] = useActionState(updateCampusWithId, { error: '', success: false, message: ''});

    // // campos para edição
    const [editNome, setEditNome] = useState(campus.nome);
    const [editCidade, setEditCidade] = useState(campus.cidade);

    // // variável para controlar a exibição quando a edição foi feita e o admin não pode mais alterar nada
    const [successMessage, setSucessMessage] = useState(false);

    // // estilos dinâmicos para os inputs
    const basicInput = `border rounded-sm p-0.5 text-sm flex-1 ${successMessage ? 'border-2 ' : ''}`;
    const borderColorInput = `${successMessage ? 'var(--color-secondary) ' : 'var(--grayish-color) '}`;

    async function handleSubmit(formData: FormData) {
        await formAction(formData);
    }

    // atualiza a página quando a alteração foi feita com sucesso
    useEffect(() => {
        if (state.success) {
            setSucessMessage(true);
            const timer = setTimeout(() => {
                setSucessMessage(false);
                router.push(`/buscar-entidades/campi/${campus.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state])

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Editar Campus</h2>

        </div>

        <hr />
    
        <form action={handleSubmit} className="p-5 flex flex-col flex-1 items-stretch gap-4">

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Nome:</Label>
            <input
                type="text"
                name="nome"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                required
                minLength={3}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Cidade:</Label>
            <select
            name="cidade"
            className={`${basicInput}`}
            value={editCidade}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditCidade(e.target.value)}
                >        
                    {cidades.map((c) => (
                        <option key={c.cidade} value={c.cidade}>
                            {c.cidade}
                        </option>
                    ))}
                </select>
        </div>


        <div className={`flex-1 gap-10 flex mt-7 justify-around ${successMessage ? 'hidden': ''}`}>
        
            <Button
            aria-label="Atualizar dados do usuário"
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            className="cursor-pointer"
            disabled={editNome === campus.nome && editCidade === campus.cidade}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

        </div>

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Campus atualizado com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}

export const cidades = [
    { 'cidade': 'Abreu e Lima'},
    { 'cidade': 'Afogados da Ingazeira'},
    { 'cidade': 'Barreiros',},
    { 'cidade': 'Belo Jardim',},
    { 'cidade': 'Cabo de Santo Agostinho',},
    { 'cidade': 'Caruaru'},
    { 'cidade': 'EAD',},
    { 'cidade': 'Garanhuns'},
    { 'cidade': 'Igarassu'},
    { 'cidade': 'Ipojuca'}, 
    { 'cidade': 'Jaboatão dos Guararapes'},
    { 'cidade': 'Olinda'},
    { 'cidade': 'Palmares'},
    { 'cidade': 'Paulista'},
    { 'cidade': 'Pesqueira'},
    { 'cidade': 'Recife'},
    { 'cidade': 'Vitória de Santo Antão'}
]