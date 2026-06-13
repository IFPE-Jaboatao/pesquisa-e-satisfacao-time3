import BasicButton from "../../BasicButton";

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

export default function UsuarioCard({
    id,
    matricula,
    nome,
    email,
    role,
    campus,
    createdAt,
    updatedAt,
}: User) {
    let badgeColor;
    if (role === 'admin') badgeColor = 'bg-green-600 text-white'
    else if (role === 'gestor') badgeColor = 'bg-blue-600 text-white'
    else if (role === 'docente') badgeColor = 'bg-red-600 text-white';
    else if (role === 'aluno') badgeColor = 'bg-amber-400'
    else {
        badgeColor = 'gray'
    }


    return (
        <div
        className="p-3 flex-col flex gap-2"
        style={{ backgroundColor: 'var(--white)'}}>
            <div className="flex flex-row justify-between items-center">
                <p>{nome}</p>
                <div className={`flex flex-row items-center justify-center p-1 rounded font-semibold ${badgeColor}`}>
                    <p className="text-center self-center">{role}</p>
                </div>
            </div>

            <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="flex flex-row gap-2">
                        <p className="italic">Matrícula:</p>
                        <p>{matricula}</p>
                    </div>
                    
                    <div className="flex flex-row gap-2">
                        <p className="italic">Email:</p>
                        <p>{email}</p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <p className="italic">Campus:</p>
                        <p>{campus || 'nenhum'}</p>
                    </div>
                </div>

                <div className="flex flex-col justify-end items-end">
                    <p className="max-sm:text-sm">Criado em: {createdAt.split(`T`)[0]}</p>
                    <p className="max-sm:text-sm">Atualizado em: {updatedAt.split(`T`)[0]}</p>
                </div>

            </div>

            <div className="self-end max-sm:self-center">
                <BasicButton title='Ver Usuário' route={`/buscar-usuarios/${id}`} /> 
            </div>

        </div>
    )
}