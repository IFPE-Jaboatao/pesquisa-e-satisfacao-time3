"use client";

import React, { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Select, Alert } from "flowbite-react";
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
    role: "",
    campusId: campiIniciais.length > 0 ? String(campiIniciais[0].id) : "",
  });

  useEffect(() => {
    if (formData.role === "ADMIN") {
      setFormData((prev) => ({ ...prev, campusId: "" }));
    } else if (formData.campusId === "" && campiIniciais.length > 0) {
      setFormData((prev) => ({ ...prev, campusId: String(campiIniciais[0].id) }));
    }
  }, [formData.role, formData.campusId, campiIniciais]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-xl shadow-md border-0 p-6">
      <div className="text-left mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          Criar Usuário
        </h2>
      </div>

      {state?.error && <Alert color="failure" className="mb-4">{state.error}</Alert>}
      {state?.success && <Alert color="success" className="mb-4">Usuário criado com sucesso!</Alert>}

      <form action={formAction} className="flex flex-col gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label style={{ color: 'var(--dark-color)'}} htmlFor="matricula" className="col-span-1 text-right">Matrícula:</Label>
          <div className="col-span-3"><TextInput style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} placeholder="Digite a matrícula" id="matricula" name="matricula" value={formData.matricula} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label style={{ color: 'var(--dark-color)'}} htmlFor="nome" className="col-span-1 text-right">Nome:</Label>
          <div className="col-span-3"><TextInput style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} placeholder="Digite o nome" id="nome" name="nome" value={formData.nome} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label style={{ color: 'var(--dark-color)'}} htmlFor="email" className="col-span-1 text-right">Email:</Label>
          <div className="col-span-3"><TextInput style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} placeholder="Digite o email" id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label style={{ color: 'var(--dark-color)'}} htmlFor="role" className="col-span-1 text-right">Perfil:</Label>
          <div className="col-span-3">
            <Select style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} id="role" name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Escolha um tipo de perfil</option>
              <option value="ALUNO">Aluno</option>
              <option value="DOCENTE">Professor</option>
              <option value="GESTOR">Gestor</option>
              <option value="ADMIN">Administrador</option>
            </Select>
          </div>
        </div>

        {formData.role !== "ADMIN" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label style={{ color: 'var(--dark-color)'}} htmlFor="campusId" className="col-span-1 text-right">Campus:</Label>
            <div className="col-span-3">
              <Select style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} id="campusId" name="campusId" value={formData.campusId} onChange={handleChange} required>
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
          <Label style={{ color: 'var(--dark-color)'}} htmlFor="password" className="col-span-1 text-right">Senha:</Label>
          <div className="col-span-3"><TextInput style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)'}} placeholder="Digite a senha" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required /></div>
        </div>

        <div className="flex flex-row items-stretch mt-6 justify-around">
          <Button 
            style={{ backgroundColor: 'var(--grayish-color)'}}
            type="button" 
            className="cursor-pointer"
            onClick={() => router.push('/home')}
          >
            Cancelar
          </Button>
          <Button 
            style={{backgroundColor: 'var(--color-secondary)'}}
            type="submit" 
            disabled={pending} 
            className="cursor-pointer"
          >
            {pending ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </div>
  );
}