'use client';

import { useState } from 'react';
import { CriarAvaliacaoForm, BuscaParams } from '../forms/CriarAvaliacaoForm';
import { 
  buscarTurmasAction, 
  criarAvaliacaoAction 
} from '../../../actions/criar-avaliacoes';

interface Turma {
  id: number;
  titulo: string;
  docente: string;
  turno: string;
}

interface TurmasListagemProps {
  initialCriterios: any[];
  initialCursos: any[];
}

export function TurmasListagem({ initialCriterios, initialCursos }: TurmasListagemProps) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formParams, setFormParams] = useState<BuscaParams | null>(null);
  
  const [criterios] = useState<any[]>(initialCriterios);
  const [cursos] = useState<any[]>(initialCursos);
  const [showPreview, setShowPreview] = useState(false);

  const handleBuscarTurmas = async (params: BuscaParams) => {
    setIsLoading(true);
    setError(null);
    try {
      setFormParams(params);
      const data = await buscarTurmasAction(params);
      setTurmas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar turmas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbrirPreview = () => {
    setShowPreview(true);
  };

  const handleFinalizarCriacao = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formParams,
        turmasIds: turmas.map(t => t.id)
      };
      await criarAvaliacaoAction(payload);
      alert("Avaliação criada com sucesso!");
      setShowPreview(false);
      setTurmas([]);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar avaliação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CriarAvaliacaoForm 
        onBuscarTurmas={handleBuscarTurmas} 
        isLoading={isLoading} 
        cursos={cursos} 
      />

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}

      {turmas.length > 0 && !showPreview && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Avaliações Disponíveis</h2>
          <p className="mb-6 text-gray-600">Há <strong>{turmas.length}</strong> turmas para este período.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {turmas.map((turma, index) => (
              <div key={`${turma.id}-${index}`} className="bg-white border-t-4 border-t-[#2E7D32] shadow-sm rounded-b-md p-4 transition hover:shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-2">{turma.titulo}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Docente:</strong> {turma.docente}</p>
                  <p><strong>Turma:</strong> {turma.id}</p>
                  <p><strong>Turno:</strong> {turma.turno}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center border-t pt-6">
            <button onClick={() => setTurmas([])} className="text-gray-500 hover:text-gray-700 font-medium">Cancelar</button>
            <button 
              onClick={handleAbrirPreview}
              className="bg-[#2E7D32] text-white px-10 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Próximo
            </button>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Visualização da Avaliação Final</h2>
          <div className="space-y-6 mb-6">
            {criterios.map((c: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded shadow-sm border border-gray-100">
                <p className="font-medium text-gray-800 mb-3">{c.pergunta || c.descricao}</p>
                
                {c.tipo === 'ABERTA' ? (
                  <textarea 
                    className="w-full border border-gray-300 rounded p-2 text-sm" 
                    placeholder="Espaço reservado para comentário..." 
                    disabled 
                  />
                ) : (
                  <div className="flex items-center gap-6">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <label key={num} className="flex flex-col items-center text-xs text-gray-500">
                        <input type="radio" name={`criterio-${index}`} value={num} className="mb-1" disabled />
                        {num}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => setShowPreview(false)} className="px-6 py-2 text-gray-600 border rounded">Voltar</button>
            <button 
              onClick={handleFinalizarCriacao} 
              disabled={isLoading}
              className="bg-[#2E7D32] text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
            >
              {isLoading ? "Salvando..." : "Criar Avaliação Definitiva"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}