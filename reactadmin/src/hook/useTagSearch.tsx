//QUERY
import { useQuery } from "react-query"
import useDebounce from "./useDebounce"
import { queryKey } from "@/constant/query"
import { pagination } from "@/service/TagService"
import { useCallback, useEffect, useState } from "react"

const useTagSearch = () => {

    const [searchTerm, setSearchTerm] = useState<string>('')
    const { debounce } = useDebounce()
    const { data: tags, isLoading: isTagsLoading, isError } = useQuery(
        [queryKey.tags],
        () => pagination(`keyword=${searchTerm}`),
        {
            enabled: searchTerm.length > 0,
            staleTime: 100
        }
    )

    const debounceSetSearchTerm = useCallback(
        debounce(setSearchTerm, 300)
        , []
    )

    useEffect(() => {
        if (!isTagsLoading) {
            console.log(tags);
        }
    }, [tags])

    return {
        tags,
        isTagsLoading,
        setSearchTerm: debounceSetSearchTerm
    }
}

export default useTagSearch