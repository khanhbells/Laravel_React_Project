//REACT
import { memo, useCallback, useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import CustomDialog from "@/components/CustomDialog"
import { Controller, useFormContext } from "react-hook-form";
import CustomInput from "./CustomInput";
import LoadingButton from "./LoadingButton";
//HOOK
import useDebounce from "@/hook/useDebounce";
//QUERY
import { pagination } from "@/service/TagService";
//SETTINGS
interface ITag {
    onOpenDialog: () => void,
    newTags: { value: string, label: string }[],
    setNewTags: any
}

const Tag = ({
    onOpenDialog,
    newTags,
    setNewTags
}: ITag) => {

    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const { debounce } = useDebounce()
    const { setValue, control, getValues } = useFormContext()

    const debounceTagData = debounce(async (inputValue: string, callback: (options: any) => void) => {
        if (inputValue.length) {
            const data = await pagination(`keyword=${inputValue}`)
            const options = data?.tags?.map((tag: any) => ({
                value: String(tag.id),
                label: String(tag.name)
            })) || []
            callback(options)
        }
    }, 300)

    const loadOptions = (
        inputValue: string,
        callback: (options: any) => void
    ) => {
        debounceTagData(inputValue, callback)
    }

    const combinedTags = useCallback((existingTags: any[], additionalTags: any[]) => {
        const mergedTags = [...existingTags, ...additionalTags]

        return mergedTags.filter(
            (tag, index, seft) => index === seft.findIndex((t) => t.value === tag.value)

        )
    }, [])

    useEffect(() => {
        if (newTags.length) {
            const currentTags = getValues('tags') || []
            const updateTags = combinedTags(currentTags, newTags)
            setValue('tags', updateTags)
        }
    }, [newTags, setValue, combinedTags, getValues])



    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        <div className="flex justify-between">
                            <span>Tags</span>
                            <span className="text-[blue] text-[12px] cursor-pointer" onClick={() => onOpenDialog()}>+ Thêm mới Tag</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <div className="mt-[10px]">
                        <Controller
                            name="tags"
                            defaultValue={[]}
                            control={control}
                            render={({ field }) => {
                                useEffect(() => {

                                    const combinedTags = [...field.value, ...newTags]

                                }, [newTags, field])
                                return (
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadOptions}
                                        onChange={(selected) => {
                                            const selectedTags = selected as { value: string, label: string }[]

                                            const uniqueTags = combinedTags(selectedTags, newTags).filter(tag =>
                                                selected.some(selectedTag => selectedTag.value === tag.value)
                                            )

                                            const updateNewTags = newTags.filter(tag =>
                                                selected.some(selectedTag => selectedTag === tag.value)
                                            )
                                            setNewTags(updateNewTags)
                                            field.onChange(uniqueTags || [])
                                        }}
                                        value={field.value || []}
                                        defaultOptions
                                        isMulti
                                    />
                                )
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Tag)