//REACT
import { memo, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Select from "react-select";
//INTERFACE
import { Option } from "@/components/CustomSelectBox";
import { useDispatch } from "react-redux";


interface IParentProps {
    name: string,
    options: Option[],
    showMultiple?: boolean,
    showMultipleName?: string,
    label?: string,
    [key: string]: any
}

const Parent = ({
    name,
    options = [],
    showMultiple = false,
    showMultipleName,
    label,
    ...restProps
}: IParentProps) => {
    const dispatch = useDispatch()
    const {
        register,
        formState: { errors },
        control,
        getValues
    } = useFormContext()
    const errorMessage = errors[name]?.message

    const [defaultSelectValue, _] = useState<Option | null>(null)

    useEffect(() => {
        // Lấy giá trị hiện tại của field
        const currentValue = getValues(name);

        // Nếu không có giá trị, dispatch setId('')
        if (!currentValue) {
            setTimeout(() => {
                restProps.setId && dispatch(restProps.setId(null));
            }, 10); // Chờ 10ms để tránh delay render
        }
    }, [name, getValues, dispatch, restProps]);

    const combinedOptions = useMemo(() => {
        if (name === "parent_id") {
            return [...options]
        } else {
            return [...options.filter(option => option.value !== '0')]
        }
    }, [name]);

    const defaultParentValue = options?.find(option => option.value === '0')
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        {label ?? 'Danh mục cha'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <span className="text-[#f00] text-[12px] mb-[10px] block">{label ? '' : '*Chọn Root nếu không có danh mục cha'}</span>
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={getValues(name) || null}
                        render={({ field }) => (
                            <Select
                                options={combinedOptions}
                                className="w-full text-[12px]"
                                placeholder={label ?? 'Danh mục chính'}
                                onChange={(selected) => {
                                    const selectedValue = selected?.value || ''; // Nếu không có giá trị, gán thành ''
                                    field.onChange(selectedValue);
                                    restProps.setId && dispatch(restProps.setId(selectedValue));
                                }}
                                value={combinedOptions?.find(option => option.value === field.value) || null}
                            />
                        )}
                    />
                    <div className="error-line text-right ">
                        {typeof errorMessage === 'string' && (
                            <span className="text-red-500 text-xs">{errorMessage}</span>
                        )}
                    </div>
                    {(showMultiple && showMultipleName) && (
                        <div className="mt-[10px]">
                            <Controller
                                name={showMultipleName}
                                // control={control}
                                defaultValue={defaultParentValue?.value || null}
                                render={({ field }) => (
                                    <Select
                                        options={options.filter(option => option.value !== '0')}
                                        className="w-full text-[12px]"
                                        placeholder="Chọn danh mục phụ"
                                        onChange={(selected) => {
                                            const selectedValues = selected ? selected.map(option => option.value) : []
                                            field.onChange(selectedValues)
                                        }}
                                        isMulti={true}
                                        value={options?.filter(option => field.value.includes(option.value) && option.value !== '0') || []}
                                    />
                                )}
                            />
                        </div>
                    )}

                </CardContent>
            </Card>
        </>
    )
}

export default memo(Parent)