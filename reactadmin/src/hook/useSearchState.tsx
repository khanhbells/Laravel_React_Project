import { useState, useEffect } from "react"
import useReplaceDebounce from "@/hook/useReplaceDebounce";
import { searchInput } from "@/service/Frontend/FrontEndService"
import { useQuery } from "react-query"
import { endpoint } from "@/constant/endpoint"

interface IUseSearchState {
    keyword: string
}

const useSearchState = ({ keyword }: IUseSearchState) => {

    const [queryData, setQueryData] = useState<string>('')
    const [isDataSearch, setDataSearch] = useState([])

    const debounceInputSearch = useReplaceDebounce(keyword, 300)

    const { data: dataSearchAll, isLoading, isError, refetch } = useQuery(['search', queryData],
        () => searchInput(`keyword=${queryData}`, endpoint.searchHomePage), {
        enabled: queryData !== ''
    })

    useEffect(() => {
        if (debounceInputSearch !== '') {
            setQueryData(debounceInputSearch)
        } else {
            setQueryData('')
            setDataSearch([])
        }
    }, [debounceInputSearch]);

    useEffect(() => {
        if (!isLoading && dataSearchAll) {
            const fetchData = () => {
                // Làm phẳng dữ liệu, lấy phần tử thực bên trong
                const dataSearch = dataSearchAll.searchAll.flat();
                // console.log(dataSearch); // Kiểm tra dữ liệu có đúng không
                setDataSearch(dataSearch);
            };
            fetchData();
        }
    }, [dataSearchAll, isLoading, queryData])

    return { isDataSearch }
}

export default useSearchState