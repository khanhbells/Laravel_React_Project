import { useState } from "react"
import { useQuery } from "react-query"
import { getLocationData } from "@/service/BaseService"
const useLocationState = () => {
    const { isLoading, data: provinces, isError, refetch } = useQuery(['provinces'], () => getLocationData('provinces'))

    const getProvinces = async () => {

    }
    return {
        provinces: provinces || [],
        getProvinces
    }
}

export default useLocationState