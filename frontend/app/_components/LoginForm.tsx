"use client";

import { Button, ButtonGroup, Label, TextInput } from "flowbite-react";

export default function LoginForm() {
  return (
    <div className="p-2 m-10 max-h-max max-w-max rounded-sm flex flex-col bg-white">
        <h2 style={{ color: 'var(--color-primary)'}} className='font-bold text-2xl p-1'>Login</h2>
        <hr></hr>
    
        <form className="p-5 flex flex-col gap-1">
            
        <Label style={{ color: 'var(--dark-color)'}}>Matrícula</Label>
        <TextInput
            clearTheme
            type="text"
            name="matricula"
            className="border-1 rounded-sm"
        />

        <Label style={{ color: 'var(--dark-color)'}}>Senha</Label>
        <TextInput
            clearTheme
            type="password"
            name="senha"
            className="border-1 rounded-sm"
        />

        <div className="flex-1 gap-10 flex mt-5 justify-around">
            <Button type="button">
                Cancelar
            </Button>

            <Button type="submit">
                Entrar
            </Button>
        </div>
        </form>
    </div>
  );
}