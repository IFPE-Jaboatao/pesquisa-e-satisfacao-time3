"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { Curso, Disciplina } from "../../interfaces";
import { updateDisciplinaAction } from "@/actions/disciplinas";

interface Props {
    disciplina: Disciplina,
    cursos: Curso[]
}

export default function DisciplinaForm({
    disciplina,
    cursos
    }: Props) {

    const router = useRouter();
    
    // // adiciona disciplinaId a updateDisciplinaAction
    const updateDisciplinaWithId = updateDisciplinaAction.bind(null, disciplina.id);

    const [state, formAction, pending] = useActionState(updateDisciplinaWithId, { error: '', success: false, message: ''});

    // // campos para edição
    const [editNome, setEditNome] = useState(disciplina.nome);
    const [editCodigo, setEditCodigo] = useState(disciplina.codigo);
    const [editCursoId, setEditCursoId] = useState(disciplina.cursoId);

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
                router.push(`/buscar-entidades/disciplinas/${disciplina.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state, router, disciplina.id])

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Editar Disciplina</h2>

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

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Código:</Label>
            <input
                type="text"
                name="codigo"
                value={editCodigo}
                onChange={(e) => setEditCodigo(e.target.value)}
                required
                minLength={3}
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Curso:</Label>
            <select
            name="cursoId"
            className={`${basicInput}`}
            value={editCursoId}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditCursoId(Number(e.target.value))}
                >        
                    {cursos.map((c: Curso) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                </select>
        </div>


        <div className={`flex-1 gap-10 flex mt-7 justify-around ${successMessage ? 'hidden': ''}`}>
        
            <Button
            aria-label="Atualizar dados da disciplina"
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            className="cursor-pointer"
            disabled={editNome === disciplina.nome && editCursoId === disciplina.cursoId && editCodigo === disciplina.codigo}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

        </div>

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Disciplina atualizada com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}