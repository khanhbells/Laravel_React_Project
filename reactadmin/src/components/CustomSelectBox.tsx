import { Label } from "@/components/ui/label"
import Select from "react-select"
import { Controller, useFormContext } from "react-hook-form"
import { useEffect, useState } from "react"

export interface Option {
    value: string | undefined,
    label: string | undefined
}

interface CustomSelectBoxProps {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    defaultValue?: Option,
    onSelectChange?: (value: string | undefined) => void,
    isLoading?: boolean,
    rules?: object,
    value: Option | null,
    name: string,
    register?: any,
    control: any,
    errors: any,
}
const CustomSelectBox = ({
    title,
    placeholder,
    defaultValue,
    options,
    onSelectChange,
    isLoading,
    register,
    rules,
    name,
    control,
    errors,
    value
}: CustomSelectBoxProps) => {

    const [selectedValue, setSelectedValue] = useState<Option | null>(value)

    useEffect(() => {
        if (value) {
            setSelectedValue(value)
            if (onSelectChange) {
                onSelectChange(value.value)
            }
        }
    }, [value])

    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
                {title}
            </Label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field: { onChange } }) => (
                    <Select
                        options={isLoading ? [] : options}
                        className="w-[334px]"
                        placeholder={placeholder ?? ''}
                        onChange={(selected) => {
                            setSelectedValue(selected)
                            onChange(selected?.value)
                            onSelectChange && onSelectChange(selected?.value)
                        }}
                        value={selectedValue || null}
                        isLoading={isLoading}
                    />
                )}
            />
            < div className="error-line text-right mt-[-10px]" >
                {errors[name] && <span className="text-red-500 text-xs">{errors[name].message}</span>}
            </div >
        </div >
    )
}

export default CustomSelectBox