//REACT
import { useState, memo } from "react"
import AsyncSelect from 'react-select/async'
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Controller } from "react-hook-form";
//HOOK
import useDebounce from "@/hook/useDebounce";
//QUERY
import { useQuery } from "react-query";
import { pagination } from "@/service/TagService";
//SETTINGS
import { queryKey } from "@/constant/query";
import useTagSearch from "@/hook/useTagSearch";
interface ITag {

}

const Tag = ({

}: ITag) => {
    const { tags, isTagsLoading, setSearchTerm } = useTagSearch()
    const loadOptions = (
        inputValue: string,
        callback: (options: any) => void
    ) => {
        setSearchTerm(inputValue)
    }
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <div className="mt-[10px]">
                        <Controller
                            name="tags"
                            defaultValue=""
                            render={({ field }) => (
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Tag)