import { Textarea } from "./ui/textarea"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"
interface CustomTextareaProps {
    label: string,
    name: string,
    type: string | undefined,
    value?: string | null | undefined,
    className?: string,
    [key: string]: any
}

const CustomTextarea = ({
    label,
    type,
    name,
    value,
    className,
    ...restProps
}: CustomTextareaProps) => {
    const { register, formState: { errors } } = useFormContext()
    const errorMessage = errors[name]?.message
    return (
        <>
            <div className={className ?? "grid grid-cols-4 items-center gap-4 mt-[10px]"}>
                <Label htmlFor={name} className={restProps.labelClassName ?? 'text-right'}>
                    {label} {restProps.required ? <span className="text-[#f00] text-[12px]">(*)</span> : null}
                </Label>
                <Textarea
                    id={name}
                    className={` 
                        ${restProps.inputClassName ?? null} 
                        col-span-3 
                        focus-visible:ring-0
                        focus:outline-none focus:border-sky-500 focus:ring-2
                        `}
                    {...register(name)}
                    {...(restProps.onChange ? { onChange: restProps.onChange } : {})}
                    defaultValue={value || ''}
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

export default CustomTextarea