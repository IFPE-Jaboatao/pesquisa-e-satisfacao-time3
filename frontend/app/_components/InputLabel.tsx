import { Label } from "flowbite-react"

interface Props {
    label: string,
    value: string,
    disabled: boolean
}

type Label = {
    label: string
}

export function LabelGray({ label }: Label) {
    return (
        <Label style={{ color: 'var(--dark-color)'}}>{label}:</Label>
    )
}

function InputContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className='flex flex-row items-center justify-end gap-2 max-w-70 max-sm:w-40'>
            {children}
        </div>
  );
}

export default function InputLabel({label, value, disabled}: Props) {
    return(
    <InputContainer>
        <LabelGray label={label} />
        <input value={value}
        className="border rounded-sm p-0.5 pl-1 text-sm w-60 max-sm:w-30"
        style={{ borderColor: 'var(--grayish-color)'}}
        disabled={disabled}
        >
        </input>
    </InputContainer>
    )
}