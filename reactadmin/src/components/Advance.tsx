//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Select from "react-select"
import { FieldValues, useFormContext, Controller } from "react-hook-form";
import { publishs, follows } from "@/constant/general"

interface IAdvance<T extends FieldValues> {
}

const Advance = <T extends FieldValues>({
}: IAdvance<T>) => {

    const { register, formState: { errors }, control } = useFormContext()


    const publishOptions = publishs.filter(item => item.id !== 0).map(item => ({
        value: String(item.id),
        label: item.name
    }))
    const followOptions = follows.filter(item => item.id !== 0).map(item => ({
        value: String(item.id),
        label: item.name
    }))
    const defaultPublishValue = publishOptions.find(option => option.value === '2')
    const defaultFollowValue = followOptions.find(option => option.value === '2')
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Cấu hình nâng cao
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <Controller
                        name="publish"
                        control={control}
                        defaultValue={defaultPublishValue?.value || null}
                        render={({ field }) => (
                            <Select
                                options={publishOptions}
                                className="w-full text-[12px] mb-[15px]"
                                placeholder="Chọn tình trạng index"
                                onChange={(selected) => {
                                    field.onChange(selected?.value)
                                }}
                                value={publishOptions?.find(option => option.value === field.value) || defaultPublishValue}
                            />
                        )}
                    />
                    <Controller
                        name="follow"
                        control={control}
                        defaultValue={defaultFollowValue?.value || null}
                        render={({ field }) => (
                            <Select
                                options={followOptions}
                                className="w-full text-[12px] mb-[15px]"
                                placeholder="Chọn tình trạng index"
                                onChange={(selected) => {
                                    field.onChange(selected?.value)
                                }}
                                value={followOptions?.find(option => option.value === field.value) || defaultFollowValue}
                            // isLoading={isLoading}
                            />
                        )}
                    />

                </CardContent>
            </Card>
        </>
    )
}

export default Advance