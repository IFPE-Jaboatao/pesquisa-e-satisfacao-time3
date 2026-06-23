"use client";
import { Button } from "flowbite-react"
import { Periodo  } from "../interfaces";
import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { deletePeriodoAction } from "@/actions/periodos";
import PeriodoPage from "../pages/academic/PeriodoPage";
import PeriodoForm from "../forms/academic/PeriodoForm";

interface Props {
    periodo: Periodo,
}

export default function PeriodoRenderer({
    periodo
    }: Props) { 
        const router = useRouter();

        const [showEdit, setShowEdit] = useState(false);

        // mensagem de erro ao deletar
        const [deleteError, setDeleteError] = useState('');
        const [deleted, setDeleted] = useState(false);
        const [showDeletedError, setShowDeletedError] = useState(false);

        useEffect(() => {

            if (showDeletedError) {
                const timer = setTimeout(() => {
                    setShowDeletedError(false);
                }, 3000);

                return () => clearTimeout(timer);
            }

        }, [showDeletedError])

        // chama a action pra deletar o período
        async function handleDelete() {
            const res = await deletePeriodoAction({id: periodo.id});

            if (res.error) {
                setShowDeletedError(true);
                setDeleteError(res.error)
                return;
            }
            else if (res.message) {
                setDeleted(true);
            }
        }

        function goBack() {
            router.push('/buscar-entidades')
        }

        return(
            <div className="bg-white shadow-2xl p-5 rounded max-h-max justify-center flex flex-col flex-1 lg:ml-20 lg:mr-20">
                
                {!showEdit ? 

                <PeriodoPage periodo={periodo} /> : 

                <PeriodoForm periodo={periodo} />}

                <div className={`flex flex-row justify-between ${deleted ? 'hidden': ''}`}>

                    <Button
                        style={{backgroundColor: `var(--error)`}}
                        className={`max-w-max cursor-pointer ${showEdit ? 'hidden' : ''}`}
                        onClick={() => handleDelete()}>
                    Excluir
                    </Button>

                    <Button
                        style={{backgroundColor: `var(${!showEdit ? '--edit-blue' : '--grayish-color'})`}}
                        className={`max-w-max cursor-pointer ${!showEdit ? 'self-start' : 'self-end'}`}
                        onClick={() => setShowEdit(!showEdit)}>
                    {showEdit ? <ArrowUturnLeftIcon className="h-4" /> : 'Editar'}
                    </Button>

                </div>

                {!deleted ? '' : (
                    <div className="mt-5 flex flex-col justify-center">
                        <CheckCircleIcon color='green' className="h-8 flex flex-col items-center" />
                        <p className="text-center">
                            Período <span className="font-semibold">{periodo.ano}.{periodo.semestre}</span> deletado com sucesso!</p>

                        <Button
                        className="max-w-max self-start mt-5 gap-2 cursor-pointer"
                        aria-description="Botão para voltar para tela de buscar entidades institucionais e acadêmicas"
                        aria-label="Voltar"
                        style={{ backgroundColor: 'var(--grayish-color)'}}
                        type="button"
                        onClick={goBack}
                        >
                            <ArrowUturnLeftIcon className="h-4" />
                            
                        </Button>

                    </div>
                )}

                {showDeletedError ? <p className="text-red-600 text-center mt-5 font-semibold">{deleteError}</p> : ''}

            </div>
        )

    }