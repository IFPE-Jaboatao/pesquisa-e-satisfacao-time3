"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Setor, Campus } from "../../buscas/entidades/interfaces"; 
import { Button, Label } from "flowbite-react";

interface ActionState {
  error: string;
  success: boolean;
  message: string;
}

interface Props {
  campi: Campus[];
  setores: Setor[];
  // Tipagem corrigida para evitar uso de 'any'
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function CreateServicoForm({ campi, setores, action }: Props) {
  const router = useRouter();
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [state, formAction, pending] = useActionState(action, { 
      error: '', 
      success: false, 
      message: '' 
  });

  // Filtra setores para exibir apenas os do campus selecionado
  const filteredSetores = setores.filter((s) => s.campusId === Number(selectedCampusId));

  const basicInput = "border rounded-sm p-0.5 pl-1 text-sm";

  return (
      <div className="flex flex-col max-sm:flex-col self-start rounded gap-2 p-2 pl-4 pb-4 shadow-xl" style={{backgroundColor: 'var(--white)'}}>
        <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Criar Serviço</h2>
        <hr></hr>

        <form action={formAction} className="p-5 flex flex-col gap-1">
          {/* Campo Nome */}
            <Label style={{ color: 'var(--dark-color)'}}>Nome</Label>
            <input 
              type="text" 
              name="nome" 
              required 
              className={basicInput}
            />

          {/* Campo Campus */}
            <Label style={{ color: 'var(--dark-color)'}}>Campus</Label>
            <select 
              required 
              className={basicInput}
              onChange={(e) => {
                  setSelectedCampusId(e.target.value);
              }}
            >
              <option value="">Selecione um campus</option>
              {campi.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

          {/* Campo Setor (Dependente do Campus) */}
            <Label style={{ color: 'var(--dark-color)'}}>Setor</Label>
            <select 
              name="setorId" 
              required 
              disabled={!selectedCampusId}
              className={`${basicInput} focus:ring-1 focus:ring-green-700 disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">{selectedCampusId ? "Selecione um setor" : "Escolha um campus primeiro"}</option>
              {filteredSetores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>

          {/* Botões */}
          <div className="flex-1 gap-10 flex mt-5 justify-around">
            <Button 
              type="button" 
              onClick={() => router.back()} 
              style={{ backgroundColor: 'var(--grayish-color)'}}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={pending}
              style={{ backgroundColor: 'var(--color-tertiary)'}}
            >
              {pending ? 'Criando...' : 'Criar'}
            </Button>
          </div>

          {state?.error && <p className="text-red-600 text-sm text-center font-medium">{state.error}</p>}
          {state?.success && <p className="text-green-600 text-sm text-center font-medium">{state.message}</p>}
        </form>
      </div>
  );
}