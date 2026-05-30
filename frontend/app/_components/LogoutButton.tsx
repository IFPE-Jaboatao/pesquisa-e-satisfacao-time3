import { logoutAction } from "@/actions/auth";
import { Button } from "flowbite-react";

export default function LogoutButton() {

return (
    <form action={logoutAction} className="mt-4 self-center pb-5">
            <Button
                type="submit"
                className="text-white rounded px-4 py-2 font-semibold"
                style={{ backgroundColor: 'var(--error)'}}
                >
            Sair
            </Button>
        </form>
    )
}