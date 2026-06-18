"use client";

import React, { useState, useMemo } from "react";
import { Button, Label, TextInput, Select, Card, Alert, Textarea } from "flowbite-react";
import { criarPesquisaSatisfacaoAction } from "@/actions/pesquisa";

enum TipoQuestao {
  ESCALA = "ESCALA",
  MULTIPLA = "MULTIPLA",
  ABERTA = "ABERTA",
}

interface CreateQuestaoParcialDto {
  pergunta: string;
  tipo: TipoQuestao;
  opcoes?: string[];
  escalaMax?: number;
}

interface ServicoCampus {
  id: number;
  nome: string;
}

interface SetorCampus {
  id: number;
  nome: string;
  servicos: ServicoCampus[];
}

interface CriarPesquisaProps {
  setores: SetorCampus[];
}

export default function CriarPesquisa({ setores = [] }: CriarPesquisaProps) {
  const [questoes, setQuestoes] = useState<CreateQuestaoParcialDto[]>([]);
  const [novaPergunta, setNovaPergunta] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoQuestao>(TipoQuestao.ABERTA);
  const [novaOpcao, setNovaOpcao] = useState("");
  const [opcoesList, setOpcoesList] = useState<string[]>([]);
  const [escalaMax, setEscalaMax] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [setorSelecionadoId, setSetorSelecionadoId] = useState<number | null>(null);

  // CORREÇÃO: Garante o retorno seguro de um array vazio se 'servicos' estiver ausente ou nulo no banco
  const servicosDisponiveis = useMemo(() => {
    if (!setorSelecionadoId || !Array.isArray(setores)) return [];
    const setor = setores.find((s) => s.id === setorSelecionadoId);
    return setor && Array.isArray(setor.servicos) ? setor.servicos : [];
  }, [setorSelecionadoId, setores]);

  const handleAdicionarQuestao = () => {
    if (!novaPergunta.trim()) return;

    const novaQuestao: CreateQuestaoParcialDto = {
      pergunta: novaPergunta.trim(),
      tipo: novoTipo,
    };

    if (novoTipo === TipoQuestao.MULTIPLA) {
      if (opcoesList.length < 2) {
        alert("Questões de múltipla escolha exigem no mínimo 2 opções.");
        return;
      }
      novaQuestao.opcoes = opcoesList;
    }

    if (novoTipo === TipoQuestao.ESCALA) {
      if (escalaMax < 3) {
        alert("A escala mínima permitida pelo sistema é 3.");
        return;
      }
      novaQuestao.escalaMax = Number(escalaMax);
    }

    setQuestoes([...questoes, novaQuestao]);
    setNovaPergunta("");
    setOpcoesList([]);
    setNovaOpcao("");
    setEscalaMax(5);
  };

  const handleAdicionarOpcaoLista = () => {
    if (novaOpcao.trim() && !opcoesList.includes(novaOpcao.trim())) {
      setOpcoesList([...opcoesList, novaOpcao.trim()]);
      setNovaOpcao("");
    }
  };

  const handleRemoverQuestao = (index: number) => {
    setQuestoes(questoes.filter((_, i) => i !== index));
  };

  const clientAction = async (formData: FormData) => {
    setLoading(true);
    setStatus(null);

    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const dataInicio = formData.get("dataInicio") as string;
    const dataFinal = formData.get("dataFinal") as string;
    const servicoId = formData.get("servicoId") as string;

    if (descricao.length < 10) {
      setStatus({ type: "error", message: "A descrição deve conter pelo menos 10 caracteres." });
      setLoading(false);
      return;
    }

    if (new Date(dataInicio) >= new Date(dataFinal)) {
      setStatus({ type: "error", message: "A data final deve ser posterior à data de início." });
      setLoading(false);
      return;
    }

    if (questoes.length < 1) {
      setStatus({ type: "error", message: "A pesquisa precisa de pelo menos 1 questão cadastrada." });
      setLoading(false);
      return;
    }

    const payload = {
      titulo,
      descricao,
      dataInicio,
      dataFinal,
      servicoId: Number(servicoId),
      questoes: questoes,
    };

    const result = await criarPesquisaSatisfacaoAction(payload);

    if (result?.error) {
      setStatus({ type: "error", message: result.error });
      setLoading(false);
    } else {
      setStatus({ type: "success", message: "Pesquisa cadastrada com sucesso!" });
      setQuestoes([]);
      setSetorSelecionadoId(null);
      setLoading(false);
    }
  };

  // Garante consistência local caso o parâmetro externo sofra mutações
  const listaSetoresValida = Array.isArray(setores) ? setores : [];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 my-6" style={{ backgroundColor: "var(--light-color)" }}>
      <Card className="w-full max-w-xl shadow-lg border-0" style={{ backgroundColor: "var(--white)" }}>
        <h1 className="text-2xl font-bold tracking-tight text-center" style={{ color: "var(--color-primary)" }}>
          Nova Pesquisa de Satisfação
        </h1>
        
        {status && (
          <Alert color={status.type === "success" ? "success" : "failure"} className="mt-2">
            <span>{status.message}</span>
          </Alert>
        )}

        <form action={clientAction} className="flex flex-col gap-4 mt-2">
          <div>
            <Label htmlFor="titulo">Título da Pesquisa</Label>
            <TextInput id="titulo" name="titulo" type="text" required />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição ou Orientações</Label>
            <Textarea id="descricao" name="descricao" required rows={3} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data de Início</Label>
              <TextInput id="dataInicio" name="dataInicio" type="date" required />
            </div>
            <div>
              <Label htmlFor="dataFinal">Data de Término</Label>
              <TextInput id="dataFinal" name="dataFinal" type="date" required />
            </div>
          </div>

          <div>
            <Label htmlFor="setorId">Setor Responsável</Label>
            <Select 
              id="setorId" 
              required 
              value={setorSelecionadoId || ""} 
              onChange={(e) => {
                setSetorSelecionadoId(Number(e.target.value) || null);
                const servicoSelect = document.getElementById("servicoId") as HTMLSelectElement;
                if (servicoSelect) servicoSelect.value = "";
              }}
            >
              {listaSetoresValida.length === 0 ? (
                <option value="" disabled>Nenhum setor localizado para este campus...</option>
              ) : (
                <>
                  <option value="" disabled>Selecione um setor...</option>
                  {listaSetoresValida.map((setor) => (
                    <option key={setor.id} value={setor.id}>{setor.nome}</option>
                  ))}
                </>
              )}
            </Select>
          </div>

          <div>
            <Label htmlFor="servicoId">Serviço Avaliado</Label>
            <Select id="servicoId" name="servicoId" required defaultValue="" disabled={!setorSelecionadoId}>
              {!setorSelecionadoId ? (
                <option value="" disabled>Selecione um setor primeiro...</option>
              ) : servicosDisponiveis.length === 0 ? (
                <option value="" disabled>Nenhum serviço cadastrado neste setor...</option>
              ) : (
                <>
                  <option value="" disabled>Selecione um serviço institucional...</option>
                  {servicosDisponiveis.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </>
              )}
            </Select>
          </div>

          <hr className="my-2 border-gray-200" />

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex flex-col gap-3">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>Montar Questão</h3>
            <TextInput type="text" placeholder="Enunciado da pergunta" value={novaPergunta} onChange={(e) => setNovaPergunta(e.target.value)} />
            <Select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value as TipoQuestao)}>
              <option value={TipoQuestao.ABERTA}>Aberta (Texto Livre)</option>
              <option value={TipoQuestao.MULTIPLA}>Múltipla Escolha</option>
              <option value={TipoQuestao.ESCALA}>Escala Numérica</option>
            </Select>

            {novoTipo === TipoQuestao.MULTIPLA && (
              <div className="p-3 bg-white rounded border flex flex-col gap-2">
                <Label className="text-xs font-bold">Cadastrar Opções</Label>
                <div className="flex gap-2">
                  <TextInput type="text" className="flex-1" value={novaOpcao} onChange={(e) => setNovaOpcao(e.target.value)} />
                  <Button type="button" onClick={handleAdicionarOpcaoLista}>+</Button>
                </div>
                <ul className="list-disc pl-5 text-xs text-gray-600">
                  {opcoesList.map((op, idx) => <li key={idx}>{op}</li>)}
                </ul>
              </div>
            )}

            {novoTipo === TipoQuestao.ESCALA && (
              <div className="p-3 bg-white rounded border flex flex-col gap-2">
                <Label className="text-xs font-bold">Limite Superior (Mínimo 3)</Label>
                <TextInput type="number" min={3} value={escalaMax} onChange={(e) => setEscalaMax(Number(e.target.value))} />
              </div>
            )}

            <Button type="button" onClick={handleAdicionarQuestao} size="sm">Adicionar Questão</Button>
          </div>

          <div className="mt-2">
            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Questões Adicionadas ({questoes.length})</h4>
            {questoes.map((q, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded border bg-white text-xs mb-1">
                <p className="font-semibold text-gray-800 truncate">{idx + 1}. {q.pergunta} ({q.tipo})</p>
                <button type="button" onClick={() => handleRemoverQuestao(idx)} style={{ color: "var(--error)" }}>Remover</button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading || questoes.length === 0} style={{ backgroundColor: "var(--color-primary)", color: "var(--white)" }}>
            {loading ? "Processando..." : "Criar Pesquisa de Satisfação"}
          </Button>
        </form>
      </Card>
    </div>
  );
}