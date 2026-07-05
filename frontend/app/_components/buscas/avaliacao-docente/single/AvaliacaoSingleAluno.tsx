'use client';

import { useActionState, useEffect } from "react";
import { submitResponse } from "@/actions/pesquisa";
import { Button } from "flowbite-react";
import { HeaderResponder } from "../../avaliacao-docente/single/HeaderResultado";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { QuestaoAberta, QuestaoEscala, QuestaoMultipla } from "../../pesquisa-satisfacao/single/PesquisaSingleAluno";

interface Props {
    avaliacao: {
        id: string,
        titulo: string,
        descricao: string,
        dataInicio: string,
        dataFinal: string,
        tipoId: number,
        questoes?: Questao[],
        curso: string,
        turno: string
    }
}

interface Questao {
    id: string,
    tipo?: string,
    pergunta: string,
    escalaMax?: number,
    opcoes?: string[]
}

export default function AvaliacaoSingleAluno({ avaliacao }: Props) {
    const router = useRouter();

    const submitResponseWithId = submitResponse.bind(null, avaliacao.id);

    const [state, formAction, pending] = useActionState(submitResponseWithId, { error: '', success: false, message: ''});

    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                router.push('/buscar-avaliacoes-docente');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state, router])

    return (
        <div className="flex flex-1 flex-col">
            <HeaderResponder pesquisa={false} />

            <div className="ml-10 mr-10 mb-10 pb-20 mt-3 max-sm:ml-5 max-sm:mr-5 pl-10 pr-10 pt-5 max-sm:pl-5 max-sm:pr-5 max-sm:pt-3 flex-1 rounded shadow-2xl" style={{backgroundColor: 'var(--white)'}}>
                <p className="font-semibold text-3xl">{avaliacao.titulo}</p>

                <p className="mt-3">{avaliacao.descricao}</p>
                
                    <div className="flex flex-row justify-between w-max gap-20 pt-5 pb-10">
                        <div>
                            <p><span className="italic">Turma: </span>{avaliacao.tipoId}</p>
                            <p><span className="italic">Turno: </span>{avaliacao.turno}</p>
                            <p><span className="italic">Curso: </span>{avaliacao.curso}</p>
                        </div>
                        <div>
                            <p><span className="">Início:</span> {avaliacao.dataInicio ? new Date(avaliacao.dataInicio).toLocaleDateString('pt-br') : ''}</p>
                            <p><span className="">Término:</span> {avaliacao.dataFinal ? new Date(avaliacao.dataFinal).toLocaleDateString('pt-br') : ''}</p>  
                        </div>
                    </div>

                <hr className="pb-10" style={{borderColor: 'var(--grayish-color)'}}></hr>
                
                <form className={`gap-5 flex flex-col ${state.success ? 'hidden' : ''}`} action={formAction}>
                    <h3 style={{ color: 'var(--color-primary)'}} className="text-xl font-bold">Perguntas</h3>

                    {avaliacao.questoes?.map((q) => 
                        q?.tipo === 'ABERTA' ? <QuestaoAberta key={q.id} id={q.id} pergunta={q.pergunta} />
                        : q?.tipo === 'ESCALA' ? <QuestaoEscala key={q.id} id={q.id} pergunta={q.pergunta} escalaMax={q.escalaMax} />
                        : q?.tipo === 'MULTIPLA' ? <QuestaoMultipla key={q.id} id={q.id} pergunta={q.pergunta} opcoes={q.opcoes} />
                        : ''
                    )}

                    <Button
                    disabled={pending}
                    className="self-end"
                        type='submit'
                    >
                        Enviar
                    </Button>
                </form>

            {state.success ?
            <div className="items-center flex flex-col flex-1">
                <CheckCircleIcon style={{color: 'var(--color-primary)'}} height={40} width={40} />
                <p style={{color: 'var(--color-primary)'}} className="font-semibold text-xl">Sua resposta foi registrada com sucesso!</p>
            </div>
            : ''}

            {state.error ? 
                <div className="items-center flex flex-col flex-1">
                    <FaceFrownIcon style={{color: 'var(--grayish-color)'}} height={80} width={80} />
                    <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>Houve um erro ao enviar a sua resposta.</p>
                    <p style={{color: 'var(--error)'}}>Erro: {state.error}</p>
                </div>
            : ''}

            </div>
        </div>
    )
}