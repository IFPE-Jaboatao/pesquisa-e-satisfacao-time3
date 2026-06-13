"use client";

import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select, Card, Alert, Textarea } from "flowbite-react";

// --- ENUMS OFICIAIS DO BACKEND (TYPEORM / MONGO) ---
enum TipoQuestao {
  ESCALA = "ESCALA",
  MULTIPLA = "MULTIPLA",
  ABERTA = "ABERTA",
}

// --- INTERFACES COMPATÍVEIS COM OS DTOS DO NESTJS ---
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

export default function CriarPesquisaSatisfacao() {
  // Estado estruturado do formulário baseado no CreateSatisfacaoDto
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFinal: "",
    servicoId: "",
  });

  // Array dinâmico de questões vinculadas à pesquisa
  const [questoes, setQuestoes] = useState<CreateQuestaoParcialDto[]>([]);

  // Estados locais para controle de criação da questão atual
  const [novaPergunta, setNovaPergunta] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoQuestao>(TipoQuestao.ABERTA);
  const [novaOpcao, setNovaOpcao] = useState("");
  const [opcoesList, setOpcoesList] = useState<string[]>([]);
  const [escalaMax, setEscalaMax] = useState<number>(5);

  // Estados de infraestrutura da API e UI
  const [servicos, setServicos] = useState<ServicoCampus[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Carrega os serviços vinculados ao campus do Gestor ao iniciar a tela
  useEffect(() => {
    const carregarServicos = async () => {
      const token = localStorage.getItem("access-token") || localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${process.env.API_BASE_URL}/institutional/servico`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setServicos(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, servicoId: String(data[0].id) }));
          }
        }
      } catch (err) {
        console.error("Não foi possível carregar a lista de serviços:", err);
      }
    };

    carregarServicos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Adiciona uma questão montada e validada à lista temporária
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

    // Reseta os estados da questão atual
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

  // 3. Submissão do payload estruturado e interceptação de regras do NestJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Validações locais baseadas no DTO do backend
    if (formData.descricao.length < 10) {
      setStatus({ type: "error", message: "A descrição deve conter pelo menos 10 caracteres." });
      setLoading(false);
      return;
    }

    if (new Date(formData.dataInicio) >= new Date(formData.dataFinal)) {
      setStatus({ type: "error", message: "A data final deve ser posterior à data de início." });
      setLoading(false);
      return;
    }

    if (questoes.length < 1) {
      setStatus({ type: "error", message: "A pesquisa precisa de pelo menos 1 questão cadastrada." });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access-token") || localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "Autenticação expirada. Faça login novamente." });
      setLoading(false);
      return;
    }

    // Tratamento e formatação de fuso horário compatível com o @IsDateString() do NestJS
    const payload = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      dataInicio: new Date(`${formData.dataInicio}T00:00:00`).toISOString(),
      dataFinal: new Date(`${formData.dataFinal}T23:59:59`).toISOString(),
      servicoId: Number(formData.servicoId),
      questoes: questoes,
    };

    try {
      const response = await fetch(`${process.env.API_BASE_URL}/surveys/pesquisas/satisfacao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Captura exata do erro de conflito (409) mapeado do Trello
      if (response.status === 409) {
        throw new Error("Já existe uma pesquisa de satisfação ativa para este serviço no período informado.");
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(errorMsg || "Erro ao criar a pesquisa de satisfação.");
      }

      setStatus({
        type: "success",
        message: "Pesquisa de satisfação cadastrada e liberada com sucesso!",
      });

      // Limpa os campos do formulário
      setFormData({
        titulo: "",
        descricao: "",
        dataInicio: "",
        dataFinal: "",
        servicoId: servicos.length > 0 ? String(servicos[0].id) : "",
      });
      setQuestoes([]);
    } catch (error: unknown) {
      console.log(error)
      setStatus({
        type: "error",
        message: "Erro de conexão com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4 my-6"
      style={{ backgroundColor: "var(--light-color)" }}
    >
      <Card 
        className="w-full max-w-xl shadow-lg border-0"
        style={{ backgroundColor: "var(--white)" }}
      >
        <h1 
          className="text-2xl font-bold tracking-tight text-center"
          style={{ color: "var(--color-primary)" }}
        >
          Nova Pesquisa de Satisfação
        </h1>
        <p 
          className="text-sm text-center -mt-2 font-medium"
          style={{ color: "var(--grayish-color)" }}
        >
          Crie questionários para avaliar os serviços institucionais do campus.
        </p>

        {status && (
          <Alert 
            color={status.type === "success" ? "success" : "failure"} 
            className="mt-2"
            style={{ 
              backgroundColor: status.type === "success" ? "rgba(78, 159, 61, 0.1)" : "rgba(223, 53, 53, 0.1)",
              color: status.type === "success" ? "var(--color-primary)" : "var(--error)",
              border: `1px solid ${status.type === "success" ? "var(--color-secondary)" : "var(--error)"}`
            }}
          >
            <span>{status.message}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Campo: Título */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="titulo" style={{ color: "var(--dark-color)" }}>Título da Pesquisa</Label>
            </div>
            <TextInput
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ex: Avaliação de Atendimento - Biblioteca"
              required
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          {/* Campo: Descrição */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="descricao" style={{ color: "var(--dark-color)" }}>Descrição ou Orientações</Label>
            </div>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Explique os objetivos aos respondentes (Mínimo 10 caracteres)"
              required
              rows={3}
              value={formData.descricao}
              onChange={handleChange}
            />
          </div>

          {/* Campos: Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="mb-1 block">
                <Label htmlFor="dataInicio" style={{ color: "var(--dark-color)" }}>Data de Início</Label>
              </div>
              <TextInput
                id="dataInicio"
                name="dataInicio"
                type="date"
                required
                value={formData.dataInicio}
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-1 block">
                <Label htmlFor="dataFinal" style={{ color: "var(--dark-color)" }}>Data de Término</Label>
              </div>
              <TextInput
                id="dataFinal"
                name="dataFinal"
                type="date"
                required
                value={formData.dataFinal}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Campo: Serviço Institucional */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="servicoId" style={{ color: "var(--dark-color)" }}>Serviço Avaliado</Label>
            </div>
            <Select id="servicoId" name="servicoId" value={formData.servicoId} onChange={handleChange} required>
              {servicos.length === 0 ? (
                <option value="">Nenhum serviço institucional localizado...</option>
              ) : (
                servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))
              )}
            </Select>
          </div>

          <hr className="my-2 border-gray-200" />

          {/* CONSTRUTOR DE QUESTÕES */}
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex flex-col gap-3">
            <h3 className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
              Montar Questão da Pesquisa
            </h3>
            
            <div>
              <TextInput
                type="text"
                placeholder="Enunciado da pergunta (Ex: Como avalia a rapidez?)"
                value={novaPergunta}
                onChange={(e) => setNovaPergunta(e.target.value)}
              />
            </div>

            <div>
              <Select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value as TipoQuestao)}>
                <option value={TipoQuestao.ABERTA}>Aberta (Texto Livre)</option>
                <option value={TipoQuestao.MULTIPLA}>Múltipla Escolha</option>
                <option value={TipoQuestao.ESCALA}>Escala Numérica</option>
              </Select>
            </div>

            {novoTipo === TipoQuestao.MULTIPLA && (
              <div className="p-3 bg-white rounded border border-gray-200 flex flex-col gap-2">
                <Label className="text-xs font-bold" style={{ color: "var(--dark-color)" }}>
                  Cadastrar Opções (Mínimo 2)
                </Label>
                <div className="flex gap-2">
                  <TextInput
                    type="text"
                    placeholder="Ex: Satisfeito"
                    className="flex-1"
                    value={novaOpcao}
                    onChange={(e) => setNovaOpcao(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAdicionarOpcaoLista}
                    style={{ backgroundColor: "var(--dark-color)", color: "var(--white)" }}
                  >
                    +
                  </Button>
                </div>
                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                  {opcoesList.map((op, idx) => <li key={idx}>{op}</li>)}
                </ul>
              </div>
            )}

            {novoTipo === TipoQuestao.ESCALA && (
              <div className="p-3 bg-white rounded border border-gray-200 flex flex-col gap-2">
                <Label className="text-xs font-bold" style={{ color: "var(--dark-color)" }}>
                  Limite Superior da Escala (Mínimo 3)
                </Label>
                <TextInput
                  type="number"
                  min={3}
                  value={escalaMax}
                  onChange={(e) => setEscalaMax(Number(e.target.value))}
                />
              </div>
            )}

            <Button
              type="button"
              onClick={handleAdicionarQuestao}
              size="sm"
              style={{ backgroundColor: "var(--grayish-color)", color: "var(--white)" }}
            >
              Injetar Questão na Lista
            </Button>
          </div>

          {/* LISTAGEM DE QUESTÕES ADICIONADAS */}
          <div className="mt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Questões Inclusas ({questoes.length})
            </h4>
            {questoes.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Adicione pelo menos uma pergunta acima para validar o formulário.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                {questoes.map((q, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded border bg-white text-xs border-gray-200 shadow-sm">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-gray-800 truncate">{idx + 1}. {q.pergunta}</p>
                      <span 
                        className="text-[10px] font-mono bg-opacity-25 px-1.5 py-0.5 rounded uppercase font-bold"
                        style={{ backgroundColor: "var(--tab-active)", color: "var(--color-primary)" }}
                      >
                        {q.tipo}
                      </span>
                      {q.opcoes && <span className="text-[10px] text-gray-500 ml-2">({q.opcoes.length} opções)</span>}
                      {q.escalaMax && <span className="text-[10px] text-gray-500 ml-2">(Max: {q.escalaMax})</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverQuestao(idx)}
                      className="hover:opacity-80 font-bold text-xs px-1"
                      style={{ color: "var(--error)" }}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Envio do Formulário Completo */}
          <Button 
            type="submit" 
            className="mt-2 border-0 enabled:hover:opacity-90 transition-opacity" 
            disabled={loading || questoes.length === 0}
            style={{ 
              backgroundColor: "var(--color-primary)",
              color: "var(--white)"
            }}
          >
            {loading ? "Processando..." : "Criar Pesquisa de Satisfação"}
          </Button>
        </form>
      </Card>
    </div>
  );
}