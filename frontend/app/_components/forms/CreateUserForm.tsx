"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Select, Card, Alert } from "flowbite-react";
import { createUserAction, Campus } from "@/actions/user-actions";

interface CreateUserFormProps {
  campiIniciais: Campus[];
}

export default function CreateUserForm({ campiIniciais }: CreateUserFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createUserAction, { error: "", success: false });

  const [formData, setFormData] = React.useState({
    matricula: "",
    nome: "",
    email: "",
    password: "",
    role: "ALUNO",
    campusId: campiIniciais.length > 0 ? String(campiIniciais[0].id) : "",
  });

  useEffect(() => {
    if (formData.role === "ADMIN") {
      setFormData((prev) => ({ ...prev, campusId: "" }));
    } else if (formData.campusId === "" && campiIniciais.length > 0) {
      setFormData((prev) => ({ ...prev, campusId: String(campiIniciais[0].id) }));
    }
  }, [formData.role, campiIniciais]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-xl shadow-md border-0 p-6">
      <div className="text-left mb-6 border-b pb-2">
        <h2 className="text-xl font-bold" style={{ color: "var(--dark-color)" }}>
          Criar Usuário
        </h2>
      </div>

      {state?.error && <Alert color="failure" className="mb-4">{state.error}</Alert>}
      {state?.success && <Alert color="success" className="mb-4">Usuário criado com sucesso!</Alert>}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="matricula" className="col-span-1 text-right">Matrícula:</Label>
          <div className="col-span-3"><TextInput id="matricula" name="matricula" value={formData.matricula} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nome" className="col-span-1 text-right">Nome:</Label>
          <div className="col-span-3"><TextInput id="nome" name="nome" value={formData.nome} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="col-span-1 text-right">Email:</Label>
          <div className="col-span-3"><TextInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="col-span-1 text-right">Perfil:</Label>
          <div className="col-span-3">
            <Select id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="ALUNO">Aluno</option>
              <option value="DOCENTE">Professor</option>
              <option value="GESTOR">Gestor</option>
              <option value="ADMIN">Administrador</option>
            </Select>
          </div>
        </div>

        {formData.role !== "ADMIN" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="campusId" className="col-span-1 text-right">Campus:</Label>
            <div className="col-span-3">
              <Select id="campusId" name="campusId" value={formData.campusId} onChange={handleChange} required>
                {campiIniciais.length === 0 ? (
                  <option value="">Nenhum campus disponível...</option>
                ) : (
                  campiIniciais.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))
                )}
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="col-span-1 text-right">Senha:</Label>
          <div className="col-span-3"><TextInput id="password" name="password" type="password" value={formData.password} onChange={handleChange} required /></div>
        </div>

        <div className="flex gap-4 mt-6 justify-center">
          <Button 
            type="button" 
            color="gray" 
            className="w-40" 
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={pending} 
            className="w-40 bg-(--color-primary) hover:bg-(--color-primary)/90 border-0"
          >
            {pending ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}