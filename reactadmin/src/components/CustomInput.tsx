import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomInputProps {
    label: string,
    name: string,
    type: string | undefined,
    register: any,
    rules?: object,
    errors: any,
    // onChange?: any,
    value?: string | null | undefined
}

const CustomInput = ({ label, type, register, name, rules, errors, value }: CustomInputProps) => {
    return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={name} className="text-right">
                    {label}
                </Label>
                <Input
                    name={name}
                    type={type ?? 'text'}
                    id={name}
                    className="col-span-3"
                    {...register(name, rules)}
                    defaultValue={value || ''}
                />
            </div>
            <div className="error-line text-right mt-[-10px]">
                {errors[name] && <span className="text-red-500 text-xs">{errors[name].message}</span>}
            </div>
        </>
    )
}

export default CustomInput