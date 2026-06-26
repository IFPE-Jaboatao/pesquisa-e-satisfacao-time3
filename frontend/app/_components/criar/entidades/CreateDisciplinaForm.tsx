"use client";

import { Button, Label } from "flowbite-react";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";
import { Curso } from "../../buscas/entidades/interfaces";
import { createDisciplinaAction } from "@/actions/disciplinas";

interface Props {
    cursos: Curso[]
}

export default function CreateDisciplinaForm({ cursos }: Props) {
    const [state, formAction, pending] = useActionState(createDisciplinaAction, { error: "", success: false, message: '' });
    const [campusId, setCampusId] = useState('')

    const goBack = () => {
        redirect('/criar-entidades')
    }

    const campiMap: { id: number; nome: string }[] = Array.from(
        new Map<number, { id: number; nome: string }>(
            cursos
            .filter((p): p is Curso & { campusId: number } => p.campusId != null)
            .map(p => [
                p.campusId,
                {
                    id: p.campusId,
                    nome: typeof p.campus === "object"
                        ? p.campus.nome || ""
                        : String(p.campus ?? "")
                }
            ])
        ).values()
        );

    const cursosFiltrados = cursos.filter((s) => s.campusId === Number(campusId) || '')

  return (
    <div className="flex flex-col max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>

        <div>
            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Disciplina</h2>
            <hr></hr>
        </div>
    
        <form action={formAction} className="p-5 flex flex-col gap-1">

        <Label style={{ color: 'var(--dark-color)'}}>Nome da Disciplina</Label>
        <input
            type="text"
            name="nome"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
        />

        <Label style={{ color: 'var(--dark-color)'}}>Código da Disciplina</Label>
        <input
            type="text"
            name="codigo"
            required
            className="border rounded-sm p-0.5 pl-1 text-sm"
            style={{ borderColor: 'var(--grayish-color)'}}
        />

        <Label style={{ color: 'var(--dark-color)'}}>Campus</Label>
        <select
        name="campusId"
        className="border rounded-sm p-0.5 pl-1 text-sm"
        style={{ borderColor: 'var(--grayish-color)'}}
        onChange={(e) => setCampusId(e.target.value)}
            >
                <option>
                    Escolha um Campus
                </option>
            {campiMap.map((c: {id: number, nome: string}) => (
                    <option key={c.id} value={c.id}>
                        {c.nome}
                    </option>
                ))}
            </select>

        <Label style={{ color: 'var(--dark-color)'}}>Curso</Label>
        <select
        name="cursoId"
        required
        disabled={campusId === '' ? true : false}
        className="border rounded-sm p-0.5 pl-1 text-sm"
        style={{ borderColor: 'var(--grayish-color)'}}
            >        
                <option>
                    {campusId === '' ? '...' : 'Escolha um curso'}
                </option>
            {cursosFiltrados.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.nome? c.nome : ''}
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

        {state?.success && <p style={{color: 'var(--color-secondary)'}} className="text-center mt-5 font-semibold">Disciplina criada!</p>}

        </form>
    </div>
  );
}