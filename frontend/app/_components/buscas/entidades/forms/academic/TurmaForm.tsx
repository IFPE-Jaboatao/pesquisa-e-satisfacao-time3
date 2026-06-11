"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Curso, Disciplina, Periodo, Turma, User } from "../../interfaces";
import { updateDisciplinaAction } from "@/actions/disciplinas";
import { updateTurmaAction } from "@/actions/turmas";

interface Props {
    turma: Turma,
    disciplinas: Disciplina[],
    periodos: Periodo[],
    docentes: User[]
}

export default function TurmaForm({
    turma,
    disciplinas,
    periodos,
    docentes
    }: Props) {

    const router = useRouter();
    
    // // adiciona turmaId a updateTurmaAction
    const updateTurmaWithId = updateTurmaAction.bind(null, turma.id);

    const [state, formAction, pending] = useActionState(updateTurmaWithId, { error: '', success: false, message: ''});

    // // campos para edição
    const [editTurno, setEditTurno] = useState(turma.turno);
    const [editDisciplinaId, setEditDisciplinaId] = useState(turma.disciplina?.id);
    const [editPeriodoId, setEditPeriodoId] = useState(turma.periodo?.id);
    const [editDocenteId, setEditDocenteId] = useState(turma.docente?.id);

    const turnos = [
        { turno: 'Manhã'},
        { turno: 'Tarde'},
        { turno: 'Noite'},
        { turno: 'Integral'},
        { turno: 'EAD'},
    ]

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
                router.push(`/buscar-entidades/turmas/${turma.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state])

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Editar Turma</h2>

        </div>

        <hr />
    
        <form action={handleSubmit} className="p-5 flex flex-col flex-1 items-stretch gap-4">

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Turno:</Label>
            <select
            name="turno"
            className={`${basicInput}`}
            value={editTurno}
            required
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditTurno(e.target.value)}
                >        
                    {turnos.map((t) => (
                        <option key={t.turno} value={t.turno}>
                            {t.turno}
                        </option>
                    ))}
                </select>
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Disciplina:</Label>
            <select
            name="disciplinaId"
            className={`${basicInput}`}
            value={editDisciplinaId}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditDisciplinaId(Number(e.target.value))}
                >        
                    {disciplinas.map((d: Disciplina) => (
                        <option key={d.id} value={d.id}>
                            {d.nome}
                        </option>
                    ))}
                </select>
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Período:</Label>
            <select
            name="periodoId"
            className={`${basicInput}`}
            value={editPeriodoId}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditPeriodoId(Number(e.target.value))}
                >        
                    {periodos.map((p: Periodo) => (
                        <option key={p.id} value={p.id}>
                            {p.ano}.{p.semestre}
                        </option>
                    ))}
                </select>
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Docente:</Label>
            <select
            name="docenteId"
            className={`${basicInput}`}
            value={editDocenteId}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditDocenteId(Number(e.target.value))}
                >        
                    {docentes.map((d: User) => (
                        <option key={d.id} value={d.id}>
                            {d.nome}
                        </option>
                    ))}
                </select>
        </div>


        <div className={`flex-1 gap-10 flex mt-7 justify-around ${successMessage ? 'hidden': ''}`}>
        
            <Button
            aria-label="Atualizar dados da turma"
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            className="cursor-pointer"
            disabled={editTurno === turma.turno && editDisciplinaId === turma.disciplina?.id && editPeriodoId === turma.periodo?.id && editDocenteId === turma.docente?.id}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

        </div>

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Turma atualizada com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}