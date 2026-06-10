"use client";
import { Button } from "flowbite-react"
import { Campus } from "./interfaces"
import { useEffect, useState } from "react";
import CampusForm from "./forms/CampusForm";
import CampusPage from "./pages/CampusPage";
import { ArrowUturnLeftIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import { deleteCampusAction } from "@/actions/campi";
import { useRouter } from "next/navigation";

interface Props {
    campus: Campus,
    selfCampus: boolean
}

export default function CampusRenderer({
    campus,
    selfCampus
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

        // chama a action pra deletar o campus
        async function handleDelete() {
            if (selfCampus) {
                setShowDeletedError(true);
                setDeleteError('Você não pode deletar o campus ao qual a sua conta está associada!')
                return;
            }
    
            const res = await deleteCampusAction({id: campus.id});
    
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
            <div className="bg-white p-5 rounded max-h-max justify-center flex flex-col flex-1 lg:ml-20 lg:mr-20">
                
                {!showEdit ? 

                <CampusPage campus={campus} /> : 

                <CampusForm campus={campus} />}

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
                        <p className="self-center">Campus "{campus.nome}" deletado com sucesso!</p>

                        <Button
                        className="max-w-max self-start mt-5 gap-2 cursor-pointer"
                        aria-description="Botão para voltar para tela de buscar usuários"
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