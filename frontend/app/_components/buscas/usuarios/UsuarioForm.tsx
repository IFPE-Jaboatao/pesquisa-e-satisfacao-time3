"use client";

import { deleteUserAction, updateUserAction } from "@/actions/users";
import { ArrowUturnLeftIcon, CheckCircleIcon } from "@heroicons/react/16/solid";
import { Button, Label } from "flowbite-react";
import { redirect, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

interface User {
    id: number,
    matricula: string,
    nome: string,
    email: string,
    role: string,
    campusId?: number,
    campus?: string
}

interface Campus {
    id: number,
    nome: string,
    cidade: string
}

interface Props {
    campi: Campus[]
    user: User;
    selfEdit: boolean
}

export default function UsuarioForm({
    user,
    campi,
    selfEdit
    }: Props) {

    const router = useRouter();
    
    // adiciona userId a updateUserAction
    const updateUserWithId = updateUserAction.bind(null, user.id);

    const [state, formAction, pending] = useActionState(updateUserWithId, { error: '', success: false, message: ''});

    // campos para edição
    const [editMatricula, setEditMatricula] = useState(user.matricula);
    const [editNome, setEditNome] = useState(user.nome);
    const [editEmail, setEditEmail] = useState(user.email);
    const [editRole, setEditRole] = useState(user.role);
    const [editCampusId, setEditCampusId] = useState(user.campusId || 0);

    // mensagem de erro ao deletar
    const [deleteError, setDeleteError] = useState('');
    const [deleted, setDeleted] = useState(false);
    const [showDeletedError, setShowDeletedError] = useState(false);

    // variável para controlar a exibição quando o usuário está sendo editado
    const [editing, setEditing] = useState(false);

    // variável para controlar a exibição quando a edição foi feita e o admin não pode mais alterar nada
    const [successMessage, setSucessMessage] = useState(false);

    // estilos dinâmicos para os inputs
    const basicInput = `${editing ? 'border ' : 'border-0 '} rounded-sm p-0.5 text-sm flex-1 ${successMessage ? 'border-2 ' : ''}`;
    const borderColorInput = `${successMessage ? 'var(--color-secondary) ' : 'var(--grayish-color) '}`;

    // lista para selectbox de role
    const roles = [
        {role: 'admin', display: 'Admin'},
        {role: 'gestor', display: 'Gestor'},
        {role: 'docente', display: 'Docente'},
        {role: 'aluno', display: 'Aluno'}
    ];

    // ao desfazer as alterações e voltar a editar, todos os campos são restaurados
    function handleEdit() {
        setEditMatricula(user.matricula);
        setEditNome(user.nome);
        setEditEmail(user.email);
        setEditRole(user.role);
        setEditCampusId(user.campusId || 0);

        setEditing(!editing);
    }

    // impede que seja selecionado campus "Nenhum" quando o role não for admin
    async function handleRoleChange({role}: {role: string}) {
        await setEditRole(role);
        if (editCampusId === 0 && role !== 'admin') {
            setEditCampusId(user.campusId || 0)
        } 
    }

    // chama a action pra deletar o usuário
    async function handleDelete() {
        if (selfEdit) {
            setShowDeletedError(true);
            setDeleteError('Você não pode se excluir!')
            return;
        }

        const res = await deleteUserAction({id: user.id});

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
        redirect('/buscar-usuarios')
    }

    async function handleSubmit(formData: FormData) {
        await formAction(formData);
    }

    // redireciona o usuário para /buscar-usuarios
    // quando a alteração foi feita com sucesso
    useEffect(() => {
        if (state.success) {
            setSucessMessage(true);
            setEditing(false);
            const timer = setTimeout(() => {
                setSucessMessage(false);
                router.push(`/buscar-usuarios/${user.id}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
        else if (showDeletedError) {
            const timer = setTimeout(() => {
                setShowDeletedError(false);
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [state, showDeletedError, router, user.id])

  return (
    <div className="p-2 m-10 max-h-max max-w-max rounded-sm flex flex-col bg-white lg:max-w-200 lg:w-100">
        <div className="flex flex-row items-center flex-1 gap-1">
            <Button
            className="max-w-max cursor-pointer"
            aria-description="Botão para voltar para tela de buscar usuários"
            aria-label="Voltar"
            style={{ backgroundColor: 'var(--white)'}}
            type="button"
            disabled={pending}
            onClick={goBack}
            >
                <ArrowUturnLeftIcon className="h-4" color="grey" />
                
            </Button>

            <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Dados de Usuário</h2>

        </div>

        <hr />
    
        <form action={handleSubmit} className="p-5 flex flex-col flex-1 items-stretch gap-4">

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Matrícula:</Label>
            <input
                type="text"
                name="matricula"
                value={editing || successMessage ? editMatricula : user.matricula}
                disabled={!editing}
                onChange={(e) => setEditMatricula(e.target.value)}
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Nome:</Label>
            <input
                type="text"
                name="nome"
                disabled={!editing}
                value={editing || successMessage ? editNome : user.nome}
                onChange={(e) => setEditNome(e.target.value)}
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center">
            <Label style={{ color: 'var(--dark-color)'}}>Email:</Label>
            <input
                type="email"
                name="email"
                disabled={!editing}
                value={editing || successMessage ? editEmail : user.email}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className={`${basicInput}`}
                style={{ borderColor: borderColorInput}}
            />
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Perfil:</Label>
            <select
            name="role"
            className={`${basicInput}`}
            disabled={!editing}
            value={editing || successMessage ? editRole : user.role}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => (
                handleRoleChange({role: e.target.value})
            )}
            required
                >        
                    {roles.map((r) => (
                        <option disabled={r.role !== 'admin' && selfEdit} key={r.role} value={r.role}>
                            {r.display}
                        </option>
                    ))}
                </select>
        </div>

        <div className="flex flex-row gap-2 items-center justify-around">
            <Label style={{ color: 'var(--dark-color)'}}>Campus:</Label>
            <select
            name="campus"
            className={`${basicInput}`}
            disabled={!editing}
            value={editing || successMessage ? editCampusId || 0 : user.campusId || 0}
            style={{ borderColor: borderColorInput}}
            onChange={(e) => setEditCampusId(Number(e.target.value))}
            required={editRole !== 'admin'}
                >        
                    {campi.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nome}
                        </option>
                    ))}
                    <option disabled={editRole !== 'admin'} key={0} value={0}>
                            Nenhum
                        </option>
                </select>
        </div>


        <div className={`flex-1 gap-10 flex mt-7 justify-around ${deleted || successMessage ? 'hidden': ''}`}>
        
            <Button
            className={`${editing ? 'text-sm max-w-30' : ''}`}
            aria-description={editing ? 'Desfazer alterações nos dados do usuário' : 'Editar dados do usuário'}
            style={{backgroundColor: `${editing ? 'var(--grayish-color)' : ''}`}}
            onClick={() => handleEdit()}>
                {editing ? 'Desfazer Alterações' : 'Editar'}
            </Button>

            <Button
            className={`${editing ? '' : 'hidden'}`}
            aria-label="Atualizar dados do usuário"
            disabled={!editing}
            style={{ backgroundColor: 'var(--color-tertiary)'}}
            type="submit">
                {pending ? 'Atualizando...' : 'Atualizar'}
            </Button>

            <Button
            className={`${editing ? 'hidden' : ''}`}
            aria-label="Excluir usuário"
            disabled={editing}
            style={{ backgroundColor: 'var(--error)'}}
            type="button"
            onClick={() => handleDelete()}
            >
                {pending ? 'Excluindo...' : 'Excluir'}
            </Button>

        </div>

        {!deleted ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p>Usuário deletado com sucesso!</p>

                <Button
                className="max-w-max self-start mt-5 gap-2 cursor-pointer"
                aria-description="Botão para voltar para tela de buscar usuários"
                aria-label="Voltar"
                style={{ backgroundColor: 'var(--grayish-color)'}}
                type="button"
                disabled={pending}
                onClick={goBack}
                >
                    <ArrowUturnLeftIcon className="h-4" />
                    
                </Button>

            </div>
        )}

        {!successMessage ? '' : (
            <div className="mt-5 flex flex-col justify-center">
                <CheckCircleIcon color='green' className="h-8" />
                 <p className="text-center font-semibold" style={{color: 'var(--color-secondary)'}}>Usuário atualizado com sucesso!</p>
                 <p className="text-center italic">Estamos atualizando a página...</p>

            </div>
        )}

        {state?.error && <p className="text-red-600 text-center mt-5 font-semibold">{state.error}</p>}

        {showDeletedError ? <p className="text-red-600 text-center mt-5 font-semibold">{deleteError}</p> : ''}

        </form>
    </div>
  );
}