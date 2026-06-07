"use client";
import { useState } from "react";
import BuscaTitulo from "./BuscaTitulo";
import SatisfacaoCard from "./SatisfacaoCard";
import { LabelGray } from "../InputLabel";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "flowbite-react";
import UsuarioCard from "./UsuarioCard";

interface User {
    id: number,
    matricula: string,
    nome: string,
    email: string,
    role: string,
    campusId?: number,
    campus?: string,
    createdAt: string,
    updatedAt: string
}

interface Props {
  data: User[];
}

export default function UsuariosAdmin({ data }: Props) {
    const [search, setSearch] = useState('');
    const [roleSearch, setRoleSearch] = useState('');
    const [campusSearch, setCampusSearch] = useState('');

    // os usuários
    const todosUsuarios = data;

    const usuariosFiltrados = todosUsuarios.filter((u) => {
        // 1. filtro por nome do usuario (input de texto)
        const bateNome = u.nome.toLowerCase().includes(search.toLowerCase());

        // 2. filtro por role
        const bateRole = roleSearch === '' || u.role === roleSearch;

        // 3. filtro por campus
        const bateCampus = campusSearch === '' || u.campusId === Number(campusSearch);

        // aplica todos os filtros ao mesmo tempo
        return bateNome  && bateRole && bateCampus;
    });

    // junta os cursos presentes nas pesquisas para usar no filtro de Curso
    const campiMap = Array.from(
        new Map(
            todosUsuarios
            .filter(u => u.campusId)
            .map(u => [u.campusId, { id: u.campusId, nome: u.campus }])
        ).values()
        );

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex flex-col p-2 pl-4 pb-4 rounded m-1" style={{backgroundColor: 'var(--white)'}}>
            <div className="flex flex-row max-sm:flex-col justify-between gap-2">
                <div className="flex flex-col flex-1 gap-4 items-baseline lg:flex-1 lg:pr-30">
                    <BuscaTitulo title="Avaliações Docente" />

                    <div className="flex flex-row gap-2 items-center">
                        <input
                        placeholder="Digite para pesquisar..."
                        className="border rounded p-0.5 max-sm:max-w-40"
                        style={{color: 'var(--dark-color)', borderColor: 'var(--grayish-color)'}}
                        value={search} onChange={(e) => setSearch(e.target.value)}  />
                        
                        <MagnifyingGlassCircleIcon className="h-8 max-sm:hidden" style={{color: `var(--grayish-color)`}} />
                    </div>
                </div>

            <div className="flex flex-col flex-2">
                <p className="font-semibold" style={{color: 'var(--grayish-color)'}}>Filtros</p>
                <div className="flex flex-1 flex-row-reverse
                gap-2 max-md:items-start max-sm:items-stretch max-sm:flex-col-reverse">

                    <div className="flex flex-col flex-1 gap-1">
                        <p className="font-semibold">Perfil</p>
                        <div className="flex flex-row flex-1 max-lg:flex-1 gap-2 max-md:grid max-md:grid-cols-2 max-sm:flex max-sm:flex-col max-sm:mb-2">
                            <Button className={`hover:bg-green-900 flex-1 max-sm:pb-2 max-sm:pt-2 bg-green-${roleSearch === `admin` ? `400` : `600`}`} onClick={(e) => setRoleSearch('admin')}>Admin</Button>
                            <Button className={`hover:bg-blue-900 flex-1 max-sm:pb-2 max-sm:pt-2 bg-blue-${roleSearch === `gestor` ? `700` : `600`}`} onClick={(e) => setRoleSearch('gestor')}>Gestor</Button>
                            <Button className={`hover:bg-red-800 flex-1 max-sm:pb-2 max-sm:pt-2 bg-red-${roleSearch === `docente` ? `400` : `600`}`} onClick={(e) => setRoleSearch('docente')}>Docente</Button>
                            <Button className={`hover:bg-amber-700 hover:text-white flex-1 max-sm:pb-2 max-sm:pt-2 text-black bg-amber-${roleSearch === `aluno` ? `600` : `400`}`} onClick={(e) => setRoleSearch('aluno')}>Aluno</Button>
                        </div>
                            <Button className={`hover:bg-green-900 bg-green-${roleSearch === `` ? `400` : `700`}`} onClick={(e) => setRoleSearch('')}>Todos</Button>
                    </div>

                    <div className="flex flex-col self-start items-start justify-end content-center gap-1">
                        <p className="font-semibold">Campus</p>
                        <select name="campus" className="border rounded max-w-40 lg:max-w-max"
                        onChange={(e) => setCampusSearch(e.target.value)}
                        >
                            <option value="">Todos os Campi</option>
                            
                            {campiMap.map((campus) => (
                                <option  key={campus.id} value={campus.id}>
                                    {campus.nome}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>
            </div>

        
            </div>
            <div>
            <p>Ordenar por criacao</p>
        </div>
        </div>
            
            <div className="max-md:grid max-md:grid-cols-2 max-sm:flex max-sm:flex-col grid grid-cols-3 gap-3 mt-2 mb-2 mr-15 ml-15 max-md:mr-3 max-md:ml-3 max-sm:mr-2 max-sm:ml-2">
                {usuariosFiltrados?.map((u) => (
                    <UsuarioCard
                    key={u.id}

                    id={u.id}
                    matricula={u.matricula}
                    nome={u.nome}
                    email={u.email}
                    role={u.role}
                    campusId={u.campusId}
                    campus={u.campus}

                    createdAt={u.createdAt}
                    updatedAt={u.updatedAt}
                    />
                ))}
            </div>

        </div>
    )
}
