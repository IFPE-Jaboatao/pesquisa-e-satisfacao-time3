import { Navbar, NavbarBrand } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function HeaderLandingPage() {
    return (
        <Navbar style={{ backgroundColor: 'var(--color-primary)'}}>
            <NavbarBrand as={Link} href="/">
            <Image src="/pesquisa-logo.svg" className="mr-3" width={50} height={50} alt="Pesquisas e Avaliações Logo" />
        </NavbarBrand>
            <Link href="/login" className="mr-5 font-semibold border-0" style={{ color: 'var(--white)'}}>
            Entrar
            </Link>
        </Navbar>
    )
}