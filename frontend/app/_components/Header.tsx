import { Avatar, Navbar, NavbarBrand, NavbarCollapse, NavbarContext, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

interface HeaderProps {
    role: string,
    nome: string,
    index: number
}

export default function Header({ role, nome, index }: HeaderProps) {

    return (
        <Navbar style={{ backgroundColor: 'var(--color-primary)'}}>
        <div className="flex flex-row flex-5 items-center">
            <NavbarBrand as={Link} href="/" className="flex">
            <img src="/pesquisa-logo.svg" className="mr-3 h-12" alt="Pesquisas e Avaliações Logo" />
        </NavbarBrand>
            <div className="flex flex-col">
                <h1
                className="text-3xl max-sm:text-2xl font-semibold align-middle"
                style={{ color: 'var(--light-color)'}}
                >Dashboard - {role.slice(0,1).toUpperCase() + role.slice(1)}</h1>


            <div>
                <Link href='/home' className="mr-5 font-semibold mt-1 p-0.5 pl-2 pr-2 self-baseline rounded" style={{ backgroundColor: `${index === 1 ? 'var(--tab-active)' : 'var(--color-primary)'}`, color: 'var(--light-color)'}}>
                    Home
                </Link>
                {role === 'admin' ? (
                    <Link href='/auditoria' className="mr-5 font-semibold mt-1 p-0.5 pl-2 pr-2 self-baseline rounded" style={{ backgroundColor: `${index === 2 ? 'var(--tab-active)' : 'var(--color-primary)'}`, color: 'var(--light-color)'}}>
                    Auditoria
                </Link>
                ) : ''}
                </div>
            </div>
        </div>
        <NavbarToggle />
        
        <NavbarCollapse>
            <NavbarLink as={Link} href="/home/profile" className="mr-5 font-semibold flex flex-row justify-between items-center" style={{color: "var(--light-color)"}}>
                {nome}
                <Avatar img="/user-placeholder.png" alt="avatar of Jese" className="md:hidden" rounded />
            </NavbarLink>
        </NavbarCollapse>
        <Link href='/home/profile' className="max-md:hidden">
            <Avatar img="/user-placeholder.png" alt="avatar of Jese" rounded />
        </Link>
        </Navbar>
    )
}