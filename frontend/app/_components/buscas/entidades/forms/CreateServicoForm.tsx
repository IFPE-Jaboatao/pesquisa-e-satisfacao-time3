"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Setor, Campus } from "../interfaces"; 
import Header from "@/app/_components/Header"; 

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
  userRole: string;
  userName: string;
  userId: string | number;
}

export default function CreateServicoForm({ campi, setores, action, userRole, userName, userId }: Props) {
  const router = useRouter();
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [state, formAction, pending] = useActionState(action, { 
      error: '', 
      success: false, 
      message: '' 
  });

  // Filtra setores para exibir apenas os do campus selecionado
  const filteredSetores = setores.filter((s) => s.campusId === Number(selectedCampusId));

  return (
    <>
      <Header role={userRole} nome={userName} index={Number(userId)} />
      
      <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-sm shadow-sm mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Criar Serviço</h2>
        <div className="w-full h-px bg-gray-300 mb-6"></div>

        <form action={formAction} className="flex flex-col gap-6">
          {/* Campo Nome */}
          <div className="flex flex-row items-center gap-4">
            <label className="w-24 font-medium text-gray-700">Nome:</label>
            <input 
              type="text" 
              name="nome" 
              required 
              className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-1 focus:ring-green-700 outline-none" 
            />
          </div>

          {/* Campo Campus */}
          <div className="flex flex-row items-center gap-4">
            <label className="w-24 font-medium text-gray-700">Campus:</label>
            <select 
              required 
              className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-1 focus:ring-green-700 outline-none"
              onChange={(e) => {
                  setSelectedCampusId(e.target.value);
              }}
            >
              <option value="">Selecione um campus</option>
              {campi.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Campo Setor (Dependente do Campus) */}
          <div className="flex flex-row items-center gap-4">
            <label className="w-24 font-medium text-gray-700">Setor:</label>
            <select 
              name="setorId" 
              required 
              disabled={!selectedCampusId}
              className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-1 focus:ring-green-700 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{selectedCampusId ? "Selecione um setor" : "Escolha um campus primeiro"}</option>
              {filteredSetores.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="px-6 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 transition text-sm font-semibold"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={pending}
              className="px-6 py-2 bg-green-700 text-white rounded-sm hover:bg-green-800 transition text-sm font-semibold"
            >
              {pending ? 'Salvando...' : 'Criar'}
            </button>
          </div>

          {state?.error && <p className="text-red-600 text-sm text-center font-medium">{state.error}</p>}
          {state?.success && <p className="text-green-600 text-sm text-center font-medium">{state.message}</p>}
        </form>
      </div>
    </>
  );
}