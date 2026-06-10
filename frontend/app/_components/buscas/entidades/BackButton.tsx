import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { Button } from "flowbite-react";
import { redirect } from "next/navigation";

export default function BackButton({route, visible}: {route: string, visible: boolean}) {
    return (
        <Button
            aria-description="Botão para voltar à página anterior"
            style={{backgroundColor: `var(--${visible ? 'grayish-color' : 'white'})`}}
            className={`max-w-max cursor-pointer ${visible ? '' : 'text-black'}`}
            onClick={() => redirect(route)}>
        <ArrowUturnLeftIcon className="h-4" />
        </Button>
    )
}