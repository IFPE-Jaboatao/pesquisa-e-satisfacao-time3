"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Campus, Servico, Setor } from "../../interfaces";
import { updateSetorAction } from "@/actions/setores";
import { updateServicoAction } from "@/actions/servicos";

interface Props {
    servico: Servico,
    setores: Setor[]
}

export default function ServicoForm({
    servico,
    setores
    }: Props) {

    const router = useRouter();
    
    // // adiciona servicoId a updateServicoAction
    const updateServicoWithId = updateServicoAction.bind(null, servico.id);

    const [state, formAction, pending] = useActionState(updateServicoWithId, { error: '', success: false, message: ''});

    // // campos para edição
    const [editNome, setEditNome] = useState(servico.nome);
    const [editSetorId, setEditSetorId] = useState(servico.setor?.id);

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
                router.push(`/buscar-entidades/servicos/${servico.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state])

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Editar Serviço</h2>

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
                minLength={4}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Setor:</Label>
            <select
            name="setorId"
            className={`${basicInput}`}
            value={editSetorId}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditSetorId(Number(e.target.value))}
                >        
                    {setores.map((s: Setor) => (
                        <option key={s.id} value={s.id}>
                            {s.nome}
                        </option>
                    ))}
                </select>
        </div>


        <div className={`flex-1 gap-10 flex mt-7 justify-around ${successMessage ? 'hidden': ''}`}>
        
            <Button
            aria-label="Atualizar dados do serviço"
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            className="cursor-pointer"
            disabled={editNome === servico.nome && editSetorId === servico.setor?.id}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

        </div>

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Serviço atualizado com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}