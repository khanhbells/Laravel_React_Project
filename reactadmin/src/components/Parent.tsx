//REACT
import { useState } from "react";
import { UseFormRegister, FieldValues, FieldErrors, Controller } from "react-hook-form";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Select from "react-select"
//INTERFACE
import { Option } from "@/components/CustomSelectBox";
import { PostCataloguePayloadInput } from "@/interfaces/types/PostCatalogueType";


interface IParentProps<T extends FieldValues> {
    name: string,
    options?: Option[],
    control: any,
    register: UseFormRegister<T>,
    errors: FieldErrors<T>,
}

const Parent = <T extends FieldValues>({
    name,
    control,
    register,
    errors,
    options
}: IParentProps<T>) => {

    const [defaultSelectValue, _] = useState<Option | null>(null)

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
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={options}
                                className="w-full text-[12px]"
                                placeholder="Chọn danh mục cha"
                                onChange={(selected) => {
                                    field.onChange(selected?.value)
                                    // console.log(selected);

                                }}
                                value={options?.find(option => option.value === field.value) || null}
                            />
                        )}
                    />

                </CardContent>
            </Card>
        </>
    )
}

export default Parent