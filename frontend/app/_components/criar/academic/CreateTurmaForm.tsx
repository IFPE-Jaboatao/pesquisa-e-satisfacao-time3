"use client";

import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createTurmaAction } from "@/actions/turmas";
import { UserRole } from "@/app/types/UserRole.enum";

export interface CreateTurmaProps {
    institutional: {
        campus: {
            id: number,
            nome: string
        }[]
    },
    academic: {
        cursos: {
            id: number,
            nome: string,
            campusId: number,
            disciplinas: {
                id: number,
                nome: string
            }[]
        }[],
        periodos: {
            id: number,
            ano: number,
            semestre: number
        }[]
    },
    users: {
        id: number,
        matricula: string,
        nome: string,
        role: string,
        campusId: number
    }[]
}

export default function CreateTurmaForm({
    academic,
    institutional,
    users
    }: CreateTurmaProps) {

    const router = useRouter();
    
    const [state, formAction, pending] = useActionState(createTurmaAction, { error: '', success: false, message: ''});

    // // variável para controlar a exibição quando a edição foi feita e o admin não pode mais alterar nada
    const [successMessage, setSucessMessage] = useState(false);

    // campos
    const [campusId, setCampusId] = useState('');
    const [cursoId, setCursoId] = useState('');
    const [disciplinaId, setDisciplinaId] = useState('');
    const [docenteId, setDocenteId] = useState('');

    const campi = institutional.campus;
    const cursosFiltrados = academic.cursos.filter((s) => s.campusId === Number(campusId) || '');
    const cursoEscolhido = academic.cursos.find((c) => c.id === Number(cursoId));

    const turnos = [
        { turno: 'Manhã'},
        { turno: 'Tarde'},
        { turno: 'Noite'},
        { turno: 'Integral'},
        { turno: 'EAD'},
    ]

    // // estilos dinâmicos para os inputs
    const basicInput = `disabled:bg-gray-500/20 disabled:font-italic border rounded-sm p-0.5 text-sm max-w-2xl pr-30 flex-1 ${successMessage ? 'border-2 ' : ''}`;
    const borderColorInput = `${successMessage ? 'var(--color-secondary) ' : 'var(--grayish-color) '}`;

    async function handleSubmit(formData: FormData) {
        await formAction(formData);
    }

    const goBack = () => {
        router.back();
    }

    // atualiza a página quando a alteração foi feita com sucesso
    useEffect(() => {
        if (state.success) {
            setSucessMessage(true);
            const timer = setTimeout(() => {
                setSucessMessage(false);
                router.back();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state, router]);

  return (
    <div className="rounded-sm flex flex-col bg-white flex-1 p-5">
        <div className="flex flex-row items-center flex-1 gap-1">

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Turma</h2>

        </div>

        <hr />
    
        <form action={handleSubmit} className="p-5 flex flex-col flex-1 items-stretch gap-2">

            <Label style={{ color: 'var(--dark-color)'}}>Turno:</Label>
            <select
            name="turno"
            className={`${basicInput}`}
            required
            style={{ borderColor: borderColorInput}}
                >        
                <option value=''>
                    Escolha um turno
                </option>
                    {turnos.map((t) => (
                        <option key={t.turno} value={t.turno}>
                            {t.turno}
                        </option>
                    ))}
                </select>

            <Label style={{ color: 'var(--dark-color)'}}>Período:</Label>
            <select
            name="periodoId"
            className={`${basicInput}`}
            style={{ borderColor: borderColorInput}}
                >        
                <option value=''>
                    Escolha um período
                </option>
                    {academic.periodos.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.ano}.{p.semestre}
                        </option>
                    ))}
                </select>

            <Label style={{ color: 'var(--dark-color)'}}>Campus</Label>
            <select
            name="campusId"
            className={basicInput}
            value={campusId}
            style={{ borderColor: 'var(--grayish-color)'}}
            onChange={(e) => {
                setCursoId('');
                setDisciplinaId('');
                setDocenteId('');
                setCampusId(e.target.value);
            }}
                >
                    <option value=''>
                        Escolha um Campus
                    </option>
                    {campi?.map((c: {id: number, nome: string}) => (
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
            className={basicInput}
            value={cursoId}
            onChange={(e) => setCursoId(e.target.value)}
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

            <Label style={{ color: 'var(--dark-color)'}}>Disciplina:</Label>
            <select
            name="disciplinaId"
            className={`${basicInput}`}
            value={disciplinaId}
            disabled={cursoId === '' ? true : false}
            onChange={(e) => setDisciplinaId(e.target.value)}
            style={{ borderColor: borderColorInput}}
                >        
                    <option>
                        {cursoId === '' ? '...' : 'Escolha uma disciplina'}
                    </option>
                    {cursoEscolhido?.disciplinas?.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.nome}
                        </option>
                    ))}
                </select>

            <Label style={{ color: 'var(--dark-color)'}}>Docente:</Label>
            <select
            name="docenteId"
            disabled={campusId === '' ? true : false}
            value={docenteId}
            className={`${basicInput}`}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setDocenteId(e.target.value)}
                >        
                <option>
                    {campusId === '' ? '...' : 'Escolha um docente'}
                </option>
                    {users.filter((s) => s.campusId === Number(campusId) && s.role === UserRole.DOCENTE) 
                        .map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.nome}
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

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Turma criada com sucesso!</p>
            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        </form>
    </div>
  );
}