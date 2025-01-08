//REACT
import { memo, useState } from "react";
import { Controller } from "react-hook-form";
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


interface IParentProps {
    name: string,
    options: Option[],
    showMultiple?: boolean,
    showMultipleName?: string
}

const Parent = ({
    name,
    options = [],
    showMultiple = false,
    showMultipleName
}: IParentProps) => {


    const [defaultSelectValue, _] = useState<Option | null>(null)

    const defaultParentValue = options?.find(option => option.value === '0')
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Danh mục cha
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <span className="text-[#f00] text-[12px] mb-[10px] block">*Chọn Root nếu không có danh mục cha</span>
                    <Controller
                        name={name}
                        // control={control}
                        // defaultValue={defaultParentValue?.value || null}
                        render={({ field }) => (
                            <Select
                                options={options.filter(option => option.value !== '0')}
                                className="w-full text-[12px]"
                                placeholder="Chọn danh mục chính"
                                onChange={(selected) => {
                                    field.onChange(selected?.value)
                                }}
                                value={options?.find(option => option.value === field.value) || null}
                            />
                        )}
                    />
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