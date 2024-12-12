import { Label } from "@/components/ui/label"
import Select from "react-select"

interface Option {
    value: string | undefined,
    label: string | undefined
}

interface CustomSelectBoxProps {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    defaultValue?: Option
}
const CustomSelectBox = ({ title, placeholder, defaultValue, options }: CustomSelectBoxProps) => {
    return (
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
                {title}
            </Label>
            <Select
                options={options}
                className="w-[334px]"
                placeholder={placeholder ?? ''}
                defaultValue={defaultValue}
            />
        </div>
    )
}

export default CustomSelectBox