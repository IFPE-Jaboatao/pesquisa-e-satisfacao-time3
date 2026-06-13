"use client";

import React, { useState, useEffect } from "react";
import { Button, Label, TextInput, Select, Card, Alert } from "flowbite-react";

interface Campus {
  id: number;
  nome: string;
}

export default function CriarUsuariosAdmin() {
  // Estados para controlar os campos do formulário (Sincronizado com o CreateUserDto)
  const [formData, setFormData] = useState({
    matricula: "",
    nome: "",
    email: "",
    password: "",
    role: "ALUNO",
    campusId: "",
  });

  // Estados para armazenamento dos campi vindos do backend
  const [campi, setCampi] = useState<Campus[]>([]);
  
  // Estados para feedback e carregamento
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Carrega os campi reais cadastrados no sistema ao abrir a tela
  useEffect(() => {
    const carregarCampi = async () => {
      const token = localStorage.getItem("access-token") || localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/users/dashboard/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (data.institutional?.campus) {
            setCampi(data.institutional.campus);
            if (data.institutional.campus.length > 0) {
              setFormData((prev) => ({ ...prev, campusId: String(data.institutional.campus[0].id) }));
            }
          }
        }
      } catch (err) {
        console.error("Não foi possível carregar a lista de campi:", err);
      }
    };

    carregarCampi();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (formData.nome.length < 5) {
      setStatus({ type: "error", message: "O nome deve conter pelo menos 5 caracteres." });
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setStatus({ type: "error", message: "A senha deve conter pelo menos 6 caracteres." });
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("access-token") || localStorage.getItem("token");
    if (!token) {
      setStatus({ type: "error", message: "Autenticação expirada. Faça login novamente como Administrador." });
      setLoading(false);
      return;
    }

    const payload: any = {
      matricula: formData.matricula,
      nome: formData.nome,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role !== "ADMIN") {
      if (!formData.campusId) {
        setStatus({ type: "error", message: "O campusId é obrigatório para usuários que não são administradores." });
        setLoading(false);
        return;
      }
      payload.campusId = Number(formData.campusId);
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(errorMsg || "Erro ao processar o cadastro do usuário.");
      }

      setStatus({
        type: "success",
        message: `Usuário de matrícula "${data.matricula}" criado com sucesso!`,
      });

      setFormData({
        matricula: "",
        nome: "",
        email: "",
        password: "",
        role: "ALUNO",
        campusId: campi.length > 0 ? String(campi[0].id) : "",
      });
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Erro de conexão com o servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "var(--light-color)" }}
    >
      <Card 
        className="w-full max-w-md shadow-lg border-0"
        style={{ backgroundColor: "var(--white)" }}
      >
        <h1 
          className="text-2xl font-bold tracking-tight text-center"
          style={{ color: "var(--color-primary)" }}
        >
          Painel do Admin: Criar Usuário
        </h1>
        <p 
          className="text-sm text-center -mt-2 font-medium"
          style={{ color: "var(--grayish-color)" }}
        >
          Cadastre novos membros vinculados ao IFPE no sistema.
        </p>

        {status && (
          <Alert 
            color={status.type === "success" ? "success" : "failure"} 
            className="mt-2"
            style={{ 
              backgroundColor: status.type === "success" ? "rgba(78, 159, 61, 0.15)" : "rgba(223, 53, 53, 0.15)",
              color: status.type === "success" ? "var(--color-primary)" : "var(--error)",
              border: `1px solid ${status.type === "success" ? "var(--color-secondary)" : "var(--error)"}`
            }}
          >
            <span>{status.message}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Campo: Matrícula */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="matricula" style={{ color: "var(--dark-color)" }}>Matrícula</Label>
            </div>
            <TextInput
              id="matricula"
              name="matricula"
              type="text"
              placeholder="Ex: 202611500"
              required
              value={formData.matricula}
              onChange={handleChange}
            />
          </div>

          {/* Campo: Nome */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="nome" style={{ color: "var(--dark-color)" }}>Nome Completo</Label>
            </div>
            <TextInput
              id="nome"
              name="nome"
              type="text"
              placeholder="Mínimo de 5 caracteres"
              required
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          {/* Campo: E-mail */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="email" style={{ color: "var(--dark-color)" }}>E-mail</Label>
            </div>
            <TextInput
              id="email"
              name="email"
              type="email"
              placeholder="exemplo@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Campo: Senha */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="password" style={{ color: "var(--dark-color)" }}>Senha Inicial</Label>
            </div>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Campo: Nível de Acesso */}
          <div>
            <div className="mb-1 block">
              <Label htmlFor="role" style={{ color: "var(--dark-color)" }}>Nível de Acesso (Perfil)</Label>
            </div>
            <Select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="ALUNO">Aluno</option>
              <option value="DOCENTE">Docente</option>
              <option value="GESTOR">Gestor</option>
              <option value="ADMIN">Administrador</option>
            </Select>
          </div>

          {/* Campo: Campus (Condicional) */}
          {formData.role !== "ADMIN" && (
            <div>
              <div className="mb-1 block">
                <Label htmlFor="campusId" style={{ color: "var(--dark-color)" }}>Campus Vinculado</Label>
              </div>
              <Select id="campusId" name="campusId" value={formData.campusId} onChange={handleChange} required>
                {campi.length === 0 ? (
                  <option value="">Carregando campi do sistema...</option>
                ) : (
                  campi.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))
                )}
              </Select>
            </div>
          )}

          {/* Botão de Envio com a Cor Primária do Tema */}
          <Button 
            type="submit" 
            className="mt-2 border-0 enabled:hover:opacity-90 transition-opacity" 
            disabled={loading}
            style={{ 
              backgroundColor: "var(--color-primary)",
              color: "var(--white)"
            }}
          >
            {loading ? "Criando..." : "Criar Usuário"}
          </Button>
        </form>
      </Card>
    </div>
  );
}