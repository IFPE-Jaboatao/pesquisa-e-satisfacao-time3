'use client'
import { Button } from "flowbite-react";
import { redirect } from "next/navigation";

interface Props {
    title: string,
    route: string,
}

export default function BasicButton({title, route}: Props) {
    const goRoute = () => {
        redirect(`${route}`)
    }

return (
    <form action={goRoute} className="mt-4 self-center pb-5">
            <Button
            type="submit"
            className="rounded px-4 py-2 cursor-pointer font-semibold border"
            style={{ backgroundColor: 'var(--white)', color: 'var(--dark-color)', borderColor: 'var(--grayish-color)'}}
            >
            {title}
            </Button>
        </form>
    )
}