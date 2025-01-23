import { useQuery } from "react-query"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
interface UseTableProps {
    model: string,
    pagination: any,
    query: string,
    endpoint: string
}

interface FilterParam {
    [key: string]: string | number
}

const useTableFrontEnd = ({ model, pagination, query, endpoint }: UseTableProps) => {

    //get dữ liệu
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const initialFilterParams: FilterParam = {}

    searchParams.forEach((value, key) => {
        if (key !== 'page') {
            initialFilterParams[key] = value || ''
        }
    })

    const createQueryString = (initialFilterParams: FilterParam) => {
        const query = Object.keys(initialFilterParams)
            .filter(key => {
                const value = initialFilterParams[key]
                return !(value === null || value === '' || value === 0 || value === undefined)
            })
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(initialFilterParams[key])}`)
            .join('&')

        return query
    }

    const [page, setPage] = useState<number | null>(currentPage)
    const [queryString, setQueryString] = useState<string>(() => {

        // const query = createQueryString(initialFilterParams)
        // if (query) {
        //     return `page=${currentPage}${query !== '' ? `&${query}` : ''}`
        // }
        return `page=${currentPage}${query}`

    })
    const [filters, setFilters] = useState<FilterParam>({})

    const { isLoading, data, isError, refetch } = useQuery([model, queryString], async () => {
        const response = await pagination(queryString, endpoint);
        if (response?.code === 403) {
            navigate(-1);
        }
        return response;
    }, {});

    //Pagination
    const handlePageChange = (page: number | null) => {
        setPage(page)
    }

    const handleQueryString = useCallback((filterParam: FilterParam) => {
        setFilters(filterParam)
    }, [])

    useEffect(() => {
        setFilters(initialFilterParams)
    }, [])

    // useEffect(() => {
    //     const query = createQueryString(filters)
    //     const mainQueryString = `page=${page}${query !== '' ? `&${query}` : ''}`
    //     setQueryString(mainQueryString)
    // }, [page, filters])

    // useEffect(() => {
    //     navigate(`page=?${page}.html`, { replace: true })
    //     refetch()
    // }, [page, queryString])

    return {
        isLoading,
        data,
        isError,
        refetch,
        handlePageChange,
        handleQueryString,
    }

}
export default useTableFrontEnd