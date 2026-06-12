import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function BackButton({route, visible}: {route: string, visible: boolean}) {
    return (
        <div
        aria-description="Botão para voltar à página anterior"
        style={{backgroundColor: `var(--${visible ? 'grayish-color' : 'white'})`}}
        className={`p-3 rounded max-w-max cursor-pointer ${visible ? '' : 'text-black'}`}>
            <Link href={route}>
                <ArrowUturnLeftIcon className="h-4" />
            </Link>
        </div>
    )
}