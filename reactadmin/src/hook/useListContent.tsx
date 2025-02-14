import { useQuery } from "react-query"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"

interface UseTableProps {
    model: string,
    pagination: any,
    queryData: string,
    endpoint: string
}

interface FilterParam {
    [key: string]: string | number
}

// Hàm mã hóa dữ liệu trước khi đẩy lên URL
const encodeQuery = (query: string) => btoa(query)

// Hàm giải mã dữ liệu từ URL
const decodeQuery = (query: string) => {
    try {
        return atob(query)
    } catch (e) {
        return '' // Trả về rỗng nếu giải mã lỗi
    }
}

const useListContent = ({ model, pagination, queryData, endpoint }: UseTableProps) => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    // Giải mã dữ liệu từ URL nếu có
    const encodedQuery = searchParams.get('data')
    const decodedQuery = encodedQuery ? decodeQuery(encodedQuery) : ''

    const currentPage = new URLSearchParams(decodedQuery).get('page')
        ? parseInt(new URLSearchParams(decodedQuery).get('page')!)
        : 1

    const initialFilterParams: FilterParam = {}

    new URLSearchParams(decodedQuery).forEach((value, key) => {
        if (key !== 'page') {
            initialFilterParams[key] = value || ''
        }
    })

    const createQueryString = (filterParams: FilterParam) => {
        return Object.keys(filterParams)
            .filter(key => {
                const value = filterParams[key]
                return !(value === null || value === '' || value === 0 || value === undefined)
            })
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filterParams[key])}`)
            .join('&')
    }

    const [page, setPage] = useState<number | null>(currentPage)
    const [queryString, setQueryString] = useState<string>(() => {
        const query = createQueryString(initialFilterParams)
        return `page=${currentPage}${queryData}${query ? `&${query}` : ''}`
    })
    const [filters, setFilters] = useState<FilterParam>({})

    const { isLoading, data, isError, refetch } = useQuery([model, queryString], async () => {
        const response = await pagination(queryString, endpoint);
        if (response?.code === 403) {
            navigate(-1);
        }
        return response;
    });

    useEffect(() => {
        setQueryString(`page=${currentPage}${queryData}`)
    }, [queryData])

    // Pagination
    const handlePageChange = (page: number | null) => {
        setPage(page)
    }

    const handleQueryString = useCallback((filterParam: FilterParam) => {
        setFilters(filterParam)
    }, [])

    useEffect(() => {
        setFilters(initialFilterParams)
    }, [])

    useEffect(() => {
        const query = createQueryString(filters)
        const mainQueryString = `page=${page}${queryData}${query ? `&${query}` : ''}`
        setQueryString(mainQueryString)
    }, [page, filters, queryData])

    useEffect(() => {
        const query = createQueryString(filters)
        const queryStringForAPI = `page=${page}${queryData}${query ? `&${query}` : ''}`
        const queryStringForURL = encodeQuery(queryStringForAPI)

        setQueryString(queryStringForAPI)
        navigate(`?data=${queryStringForURL}`, { replace: true })
    }, [page, filters, queryData])

    return {
        isLoading,
        data,
        isError,
        refetch,
        handlePageChange,
        handleQueryString,
    }
}

export default useListContent
