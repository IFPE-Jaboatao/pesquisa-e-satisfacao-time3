"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Periodo } from "../../interfaces";
import { updatePeriodoAction } from "@/actions/periodos";

interface Props {
    periodo: Periodo
}

export default function PeriodoForm({
    periodo
    }: Props) {

    const router = useRouter();

    const now = new Date().getFullYear();
    
    // // adiciona periodoId a updatePeriodoAction
    const updatePeriodoWithId = updatePeriodoAction.bind(null, periodo.id);

    const [state, formAction, pending] = useActionState(updatePeriodoWithId, { error: '', success: false, message: ''});

    // // campos para edição
    const [editAno, setEditAno] = useState(periodo.ano);
    const [editSemestre, setEditSemestre] = useState(periodo.semestre);
    const [editStartDate, setEditStartDate] = useState(periodo.startDate);
    const [editEndDate, setEditEndDate] = useState(periodo.endDate);

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
                router.push(`/buscar-entidades/periodos/${periodo.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state, router, periodo.id])

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Editar Curso</h2>

        </div>

        <hr />
    
        <form action={handleSubmit} className="p-5 flex flex-col flex-1 items-stretch gap-4">

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Ano:</Label>
            <input
                type="number"
                name="ano"
                value={editAno}
                onChange={(e) => setEditAno(Number(e.target.value))}
                required
                min={2010}
                max={now+1}
                step={1}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Semestre:</Label>
            <input
                type="number"
                name="semestre"
                value={editSemestre}
                onChange={(e) => setEditSemestre(Number(e.target.value))}
                required
                min={1}
                max={2}
                step={1}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Início:</Label>
            <input
                type="date"
                name="startDate"
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Término:</Label>
            <input
                type="date"
                name="endDate"
                value={editEndDate}
                onChange={(e) => setEditEndDate(e.target.value)}
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className={`flex-1 gap-10 flex mt-7 justify-around ${successMessage ? 'hidden': ''}`}>
        
            <Button
            aria-label="Atualizar dados do período"
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            className="cursor-pointer"
            disabled={editAno === periodo.ano && editSemestre === periodo.semestre && editStartDate === periodo.startDate && editEndDate === periodo.endDate}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

        </div>

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Período atualizado com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}