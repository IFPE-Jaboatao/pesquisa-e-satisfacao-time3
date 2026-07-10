'use client';

import { useState } from 'react';
import { Periodo } from '../buscas/entidades/interfaces';

export interface BuscaParams {
  cursoId: number;
  periodoId: number;
}

interface CriarAvaliacaoFormProps {
  onBuscarTurmas: (params: BuscaParams) => void;
  isLoading: boolean;
  cursos: { id: number; nome: string }[];
  periodos: Periodo[]
}

export const CriarAvaliacaoForm = ({ onBuscarTurmas, isLoading, cursos, periodos }: CriarAvaliacaoFormProps) => {
  const [cursoId, setCursoId] = useState<string>('');
  const [periodoId, setPeriodoId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscarTurmas({
      cursoId: Number(cursoId),
      periodoId: Number(periodoId),
    });
  };

  const handleCancelar = () => {
    setCursoId('');
    setPeriodoId('');
  };

  const inputStyle = "border rounded p-2 text-sm w-full outline-none focus:ring-1 transition-all border-(--grayish-color) focus:border-[#2E7D32]";
  const labelStyle = "block text-sm font-medium mb-1";

  return (
    <form onSubmit={handleSubmit} className="rounded-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-(--color-primary)">Criar Avaliação Docente por Período</h2>
      <hr></hr>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 pt-6">
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
          <select value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputStyle} required>
            <option value="">Selecione o período</option>
            {Array.isArray(periodos) && periodos.map((p) => (
              <option key={p.id} value={p.id}>{p.ano}.{p.semestre}</option>
            ))}
          </select>
        </div>

      </div>
      
      <div className="flex justify-end items-end max-md:flex-col border-t border-(--light-color) flex-row gap-4 pb-4 pt-6">
        <button type="button" onClick={handleCancelar} className="cursor-pointer px-6 py-2 bg-(--light-color) text-gray-600 hover:text-gray-800 font-medium">Cancelar</button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="cursor-pointer rounded px-6 py-2 font-semibold text-white transition-all duration-200"
          style={{ backgroundColor: '#2E7D32', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'Buscando...' : 'Buscar Avaliações Disponíveis'}
        </button>
      </div>
    </form>
  );
};