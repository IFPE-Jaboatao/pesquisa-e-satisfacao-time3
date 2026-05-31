import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export default function HeaderLandingPage() {
    return (
        <Navbar style={{ backgroundColor: 'var(--color-primary)'}}>
            <NavbarBrand as={Link} href="/">
            <img src="/pesquisa-logo.svg" className="mr-3 h-6 sm:h-12" alt="Pesquisas e Avaliações Logo" />
        </NavbarBrand>
        <NavbarToggle />
        <NavbarCollapse>
            <NavbarLink as={Link} href="/login" className="mr-5">
            Entrar
            </NavbarLink>
        </NavbarCollapse>
        </Navbar>
    )
}