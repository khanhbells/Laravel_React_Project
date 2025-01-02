import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomInputProps {
    label: string,
    name: string,
    type: string | undefined,
    register: any,
    errors: any,
    value?: string | null | undefined,
    className?: string,
    [key: string]: any
}

const CustomInput = ({
    label,
    type,
    register,
    name, errors,
    value,
    className,
    ...restProps
}: CustomInputProps) => {
    return (
        <>
            <div className={className ?? "grid grid-cols-4 items-center gap-4"}>
                <Label htmlFor={name} className={restProps.labelClassName ?? 'text-right'}>
                    {label} {restProps.required ? <span className="text-[#f00] text-[12px]">(*)</span> : null}
                </Label>
                <Input
                    name={name}
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
                {errors[name] && <span className="text-red-500 text-xs">{errors[name].message}</span>}
            </div>
        </>
    )
}

export default CustomInput