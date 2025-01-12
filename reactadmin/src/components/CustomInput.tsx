import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"

interface CustomInputProps {
    label?: string,
    name: string,
    type: string | undefined,
    value?: string | null | undefined,
    className?: string,
    [key: string]: any
}

const CustomInput = ({
    label,
    type,
    name,
    value,
    className,
    ...restProps
}: CustomInputProps) => {

    const { register, formState: { errors } } = useFormContext()
    const errorMessage = errors[name]?.message
    return (
        <>
            <div className={className ?? "grid grid-cols-4 items-center gap-4"}>
                {
                    label && <Label className="col-span-1" htmlFor={name}>{label}</Label>
                }
                <Input
                    type={type ?? 'text'}
                    id={name}
                    className={` 
                        ${restProps.inputClassName ?? null} 
                        col-span-3 
                        focus-visible:ring-0
                        focus:outline-none focus:border-sky-500 focus:ring-2
                        `}
                    {...register(name)}
                    defaultValue={value || ''}
                    {...(restProps.onChange ? { onChange: restProps.onChange } : {})}
                />
            </div>
            <div className="error-line text-right ">
                {typeof errorMessage === 'string' && (
                    <span className="text-red-500 text-xs">{errorMessage}</span>
                )}
            </div>
        </>
    )
}

export default CustomInput