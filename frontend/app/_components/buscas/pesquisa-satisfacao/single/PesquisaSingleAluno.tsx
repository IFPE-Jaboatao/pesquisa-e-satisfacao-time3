'use client';

import { useActionState, useEffect } from "react";
import { PesquisaAluno } from "../../avaliacao-docente/interface"
import { submitResponse } from "@/actions/pesquisa";
import { Button, Label } from "flowbite-react";
import { HeaderResponder } from "../../avaliacao-docente/single/HeaderResultado";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/16/solid";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

interface Props {
    pesquisa: PesquisaAluno
}

interface Questao {
    id: string,
    tipo?: string,
    pergunta: string,
    escalaMax?: number,
    opcoes?: string[]
}

export function QuestaoAberta({id, pergunta}: Questao) {
        return (
            <div className="flex flex-col">
                <p style={{color: 'var(--grayish-color)'}} className="text-sm italic font-semibold">Questão</p>
                <Label className="pb-2" style={{color: 'var(--dark-color)'}}>{pergunta}</Label>
                <input
                className="border pt-0.5 pb-0.5 pl-2 pr-1 wrap-break-word rounded"
                placeholder='Digite aqui...'
                style={{ borderColor: 'var(--grayish-color)'}}
                name={id}
                type="" required />
            </div>
        )
    }

export function QuestaoEscala({id, pergunta, escalaMax}: Questao) {
        return (
            <div className="flex flex-col">
                <p style={{color: 'var(--grayish-color)'}} className="text-sm italic font-semibold">Questão</p>
                <Label className="pb-2" style={{color: 'var(--dark-color)'}}>{pergunta}</Label>
                <div className="flex flex-1 flex-col">
                <input
                    style={{accentColor: 'var(--color-primary)'}}
                    name={id}
                    type='range'
                    min={1}
                    max={escalaMax}
                    step={1}
                    required
                />
                <p className="justify-between flex-1 flex flex-row">
                    {Array.from({ length: escalaMax ?? 5 }, (_, index) => (
                        <span key={index} className="mr-2">{index + 1}</span>
                    ))}
                </p>
                </div>
            </div>
        )
    }

export function QuestaoMultipla({id, pergunta, opcoes}: Questao) {
        return (
            <fieldset className="flex flex-col">
                <p style={{color: 'var(--grayish-color)'}} className="text-sm italic font-semibold">Questão</p>
                <Label className="pb-2" style={{color: 'var(--dark-color)'}}>{pergunta}</Label>
                {opcoes?.map((o) => 
                <label className="flex flex-row gap-2" key={o}>
                    <input className="cursor-pointer checked:cursor-default" type="checkbox" name={`${id}`} value={o} />
                    {o}
                </label>
                )}
            </fieldset>
        )
    }

export default function PesquisaSingleAluno({ pesquisa }: Props) {

    const router = useRouter();

    const submitResponseWithId = submitResponse.bind(null, pesquisa.id);

    const [state, formAction, pending] = useActionState(submitResponseWithId, { error: '', success: false, message: ''});

    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                router.push('/buscar-pesquisas-satisfacao');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [state, router])

    return (
        <div className="flex flex-1 flex-col">
            <HeaderResponder pesquisa={true} />

            <div className="ml-10 mr-10 mb-10 pb-20 mt-3 max-sm:ml-5 max-sm:mr-5 pl-10 pr-10 pt-5 max-sm:pl-5 max-sm:pr-5 max-sm:pt-3 flex-1 rounded shadow-2xl" style={{backgroundColor: 'var(--white)'}}>
                <p className="font-semibold text-3xl">{pesquisa?.titulo}</p>

                <p className="mt-3">{pesquisa?.descricao}</p>
                    
                    <div className="flex flex-row justify-between w-max gap-20 pt-5 pb-10">
                        <div>
                            <p><span className="italic">Setor:</span> {pesquisa.nomeSetor}</p>
                            <p><span className="italic">Serviço:</span> {pesquisa.nomeServico}</p>
                        </div>
                        <div>
                            <p><span className="">Início:</span> {pesquisa?.dataInicio ? new Date(pesquisa?.dataInicio).toLocaleDateString('pt-br') : ''}</p>
                            <p><span className="">Término:</span> {pesquisa?.dataFinal ? new Date(pesquisa?.dataFinal).toLocaleDateString('pt-br') : ''}</p>  
                        </div>
                    </div>

                <hr className="pb-10" style={{borderColor: 'var(--grayish-color)'}}></hr>
                
                <form className={`gap-5 flex flex-col ${state.success ? 'hidden' : ''}`} action={formAction}>
                    <h3 style={{ color: 'var(--color-primary)'}} className="text-xl font-bold">Perguntas</h3>

                    {pesquisa?.questoes.map((q) => 
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