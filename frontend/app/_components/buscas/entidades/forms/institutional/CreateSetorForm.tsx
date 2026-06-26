"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation"; // Importação necessária
import { Campus } from "../../interfaces"; 
import Header from "../../../../Header"; 

interface Props {
  campi: Campus[];
  action: (prevState: any, formData: FormData) => Promise<any>;
  userRole: string;
  userName: string;
  userId: string | number;
}

export default function CreateSetorForm({ campi, action, userRole, userName, userId }: Props) {
  const router = useRouter(); // Inicializa o hook de navegação
  const [state, formAction, pending] = useActionState(action, { 
      error: '', 
      success: false, 
      message: '' 
  });

  return (
    <>
      <Header role={userRole} nome={userName} index={Number(userId)} />
      
      <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-sm shadow-sm mt-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Criar Setor</h2>
        <div className="w-full h-px bg-gray-300 mb-6"></div>

        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-4">
            <label className="w-24 font-medium text-gray-700">Nome:</label>
            <input 
              type="text" 
              name="nome" 
              required 
              className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-1 focus:ring-green-700 outline-none" 
            />
          </div>

          <div className="flex flex-row items-center gap-4">
            <label className="w-24 font-medium text-gray-700">Campus:</label>
            <select 
              name="campusId" 
              required 
              className="flex-1 border border-gray-300 rounded-sm p-2 focus:ring-1 focus:ring-green-700 outline-none"
            >
              <option value="">Selecione um campus</option>
              {campi.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {/* Botão Cancelar agora com funcionalidade de retorno */}
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

          {state?.error && <p className="text-red-600 text-sm text-center">{state.error}</p>}
          {state?.success && <p className="text-green-600 text-sm text-center">{state.message}</p>}
        </form>
      </div>
    </>
  );
}