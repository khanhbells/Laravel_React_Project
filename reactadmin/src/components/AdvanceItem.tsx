import { FieldValues, useFormContext, Controller } from "react-hook-form";
import Select from 'react-select'

type OptionItem = {
    value: string,
    label: string
}
interface IAdvanceItem {
    options: OptionItem[],
    name: string
}

const AdvanceItem = ({
    options,
    name
}: IAdvanceItem) => {
    const { control } = useFormContext()

    const defaultValue = options.find(option => option.value === '2')


    return (
        <>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue?.value || null}
                render={({ field }) => (
                    <Select
                        options={options}
                        className="w-full text-[12px] mb-[15px]"
                        placeholder="Chọn tình trạng index"
                        onChange={(selected) => {
                            field.onChange(selected?.value)
                        }}
                        value={options?.find(option => option.value === field.value) || defaultValue}
                    />
                )}
            />
        </>
    )
}

export default AdvanceItem