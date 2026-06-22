// frontend/app/criar-usuarios/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getMe } from "@/services/user.service"; 
import { fetchCampi } from "@/actions/user-actions"; 
import { Campus } from "@/actions/user-actions"; // Importando a interface Campus para tipagem correta
import CreateUserForm from "../../_components/forms/CreateUserForm";
import Header from "../../_components/Header";

export default async function CriarUsuariosAdminPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  const userRole = user.role ? String(user.role).trim().toUpperCase() : "";
  if (userRole !== "ADMIN" && userRole !== "ADMINISTRADOR") {
    redirect("/unauthorized");
  }

  //  CORREÇÃO DOS ERROS 7034 e 7005: Tipando explicitamente como um array de Campus
  let campiIniciais: Campus[] = [];
  
  try {
    campiIniciais = await fetchCampi();
  } catch (error) {
    console.error("Erro ao coletar campi no servidor:", error);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--light-color)" }}>
      <Header nome={user.nome || "Admin"} role={userRole} index={0} />
      <div className="flex items-center justify-center p-8">
        <CreateUserForm campiIniciais={campiIniciais} />
      </div>
    </div>
  );
}