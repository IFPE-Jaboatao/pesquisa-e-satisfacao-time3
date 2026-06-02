import { Label } from "flowbite-react"

interface Props {
    label: string,
    value: string,
    disabled: boolean
}

export default function InputLabel({label, value, disabled}: Props) {
    return(
    <div className='flex flex-row items-center justify-end gap-2 max-w-70 max-sm:w-40'>
        <Label style={{ color: 'var(--dark-color)'}}>{label}:</Label>
        <input value={value}
        className="border rounded-sm p-0.5 pl-1 text-sm w-60 max-sm:w-30"
        style={{ borderColor: 'var(--grayish-color)'}}
        disabled={disabled}
        >
        </input>
    </div>
    )
}