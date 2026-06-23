"use client";
import { Button } from "flowbite-react"
import { Matricula } from "../interfaces";
import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { deleteMatriculaAction } from "@/actions/matriculas";
import MatriculaPage from "../pages/academic/MatriculaPage";

interface Props {
    matricula: Matricula
}

export default function MatriculaRenderer({
    matricula
    }: Props) { 
        const router = useRouter();

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

        // chama a action pra deletar a matrícula
        async function handleDelete() {
            const res = await deleteMatriculaAction({id: matricula.id});

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
                

                <MatriculaPage matricula={matricula} />

                <div className={`flex flex-row justify-between ${deleted ? 'hidden': ''}`}>

                    <Button
                        style={{backgroundColor: `var(--error)`}}
                        className={`max-w-max cursor-pointer`}
                        onClick={() => handleDelete()}>
                    Excluir
                    </Button>

                </div>

                {!deleted ? '' : (
                    <div className="mt-5 flex flex-col justify-center">
                        <CheckCircleIcon color='green' className="h-8 flex flex-col items-center" />
                        <p className="text-center">
                            Matrícula N° <span className="font-semibold">{matricula.id} </span> deletada com sucesso!</p>

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