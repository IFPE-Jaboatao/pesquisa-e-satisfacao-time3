'use client';

import { useState } from 'react';

export interface BuscaParams {
  cursoId: number;
  periodoId: number;
  dataInicio: string;
  dataTermino: string;
}

interface CriarAvaliacaoFormProps {
  onBuscarTurmas: (params: BuscaParams) => void;
  isLoading: boolean;
  cursos: { id: number; nome: string }[];
}

export const CriarAvaliacaoForm = ({ onBuscarTurmas, isLoading, cursos }: CriarAvaliacaoFormProps) => {
  const [cursoId, setCursoId] = useState<string>('');
  const [periodoId, setPeriodoId] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataTermino, setDataTermino] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscarTurmas({
      cursoId: Number(cursoId),
      periodoId: Number(periodoId),
      dataInicio,
      dataTermino
    });
  };

  const handleCancelar = () => {
    setCursoId('');
    setPeriodoId('');
    setDataInicio('');
    setDataTermino('');
  };

  const inputStyle = "border rounded p-2 text-sm w-full outline-none focus:ring-1 transition-all border-(--grayish-color) focus:border-[#2E7D32]";
  const labelStyle = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white border border-(--grayish-color) rounded-lg shadow-sm w-full max-w-4xl">
      <h2 className="text-xl font-bold mb-6 text-[#2D3748]">Criar Avaliação Docente por Período</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className={labelStyle}>Curso</label>
          <select value={cursoId} onChange={(e) => setCursoId(e.target.value)} className={inputStyle} required>
            <option value="">Selecione o curso</option>
            {Array.isArray(cursos) && cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelStyle}>Período</label>
          <input type="number" value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputStyle} required placeholder="Ex: 20261" />
        </div>

        <div>
          <label className={labelStyle}>Data de Início</label>
          <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className={inputStyle} required />
        </div>

        <div>
          <label className={labelStyle}>Data de Término</label>
          <input type="date" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} className={inputStyle} required />
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
        <button type="button" onClick={handleCancelar} className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">Cancelar</button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="rounded px-6 py-2 font-semibold text-white transition-all duration-200"
          style={{ backgroundColor: '#2E7D32', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'Buscando...' : 'Criar Avaliação'}
        </button>
      </div>
    </form>
  );
};