import { useQuery } from "react-query"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
interface UseTableProps {
    model: string,
    pagination: any
}

interface FilterParam {
    [key: string]: string | number
}

const useTable = ({ model, pagination }: UseTableProps) => {

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

        const query = createQueryString(initialFilterParams)
        if (query) {
            return `page=${currentPage}${query !== '' ? `&${query}` : ''}`
        }
        return ''

    })
    const [filters, setFilters] = useState<FilterParam>({})

    const { isLoading, data, isError, refetch } = useQuery(['users', queryString], () => pagination(queryString))




    //Pagination
    const handlePageChange = (page: number | null) => {
        setPage(page)
        navigate(`?${queryString}`)
    }

    const handleQueryString = useCallback((filterParam: FilterParam) => {
        setFilters(filterParam)
    }, [])

    useEffect(() => {
        setFilters(initialFilterParams)
    }, [])

    useEffect(() => {
        const query = createQueryString(filters)
        const mainQueryString = `page=${page}${query !== '' ? `&${query}` : ''}`
        if (query) {
            setQueryString(mainQueryString)
        }
    }, [page, filters, refetch])

    useEffect(() => {
        navigate(`?${queryString}`)
        refetch()
    }, [queryString])

    return {
        isLoading,
        data,
        isError,
        refetch,
        handlePageChange,
        handleQueryString
    }

}
export default useTable