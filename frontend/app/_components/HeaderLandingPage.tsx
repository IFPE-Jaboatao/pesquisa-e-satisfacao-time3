import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export default function HeaderLandingPage() {
    return (
        <Navbar style={{ backgroundColor: 'var(--color-primary)'}}>
            <NavbarBrand as={Link} href="/">
            <img src="/pesquisa-logo.svg" className="mr-3 h-12" alt="Pesquisas e Avaliações Logo" />
        </NavbarBrand>
            <Link href="/login" className="mr-5 font-semibold border-0" style={{ color: 'var(--white)'}}>
            Entrar
            </Link>
        </Navbar>
    )
}