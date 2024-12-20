import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getLocationData } from "@/service/BaseService"
const useLocationState = () => {

    const [provinceId, setProvinceId] = useState<string | undefined>('')
    const [districtId, setDistrictId] = useState<string | undefined>('')

    const { isLoading: isProvinceLoading, data: provinces, isError: isProvinceError } = useQuery(['provinces'], () => getLocationData('provinces', undefined))
    const { isLoading: isDistrictLoading, data: districts, isError: isDistrictError } = useQuery(
        ['districts', provinceId], () => getLocationData('districts', provinceId),
        {
            enabled: !!provinceId
        }
    )
    const { isLoading: isWardLoading, data: wards, isError: isWardError } = useQuery(
        ['wards', districtId], () => getLocationData('wards', districtId),
        {
            enabled: !!districtId
        }
    )

    // const { isLoading }

    return {
        provinces: provinces || [],
        districts: districts || [],
        wards: wards || [],
        isProvinceLoading,
        isDistrictLoading,
        isWardLoading,
        setProvinceId,
        setDistrictId,
    }
}

export default useLocationState