import { useQuery } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import { findById, pagination } from "@/service/Frontend/FrontEndService";

interface IGetFrontEndProps {
    id?: string,
    endpointCatalogue?: string,
    endpoint: string,
    filter: string,
    queryKey: string,
    queryKeyCatalogue?: string

}

const useGetDataFrontEnd = ({ id, endpointCatalogue, endpoint, filter, queryKeyCatalogue, queryKey }: IGetFrontEndProps) => {
    const { data: dataCatalogue, isLoading: isCatalogueLoading, isError: isErrorCatalogue } = useQuery([queryKeyCatalogue, id], () => endpointCatalogue ? findById(id, endpointCatalogue) : Promise.resolve(null), {
        enabled: !!id
    })
    const { data, isLoading, isError } = useQuery([queryKey], () => pagination(filter, endpoint), {
        enabled: !!filter && !!endpoint && !!queryKey
    })

    const [getData, setData] = useState();

    useEffect(() => {
        if (data && data?.[queryKey]) {
            setData(data?.[queryKey])
        }
    }, [dataCatalogue, data, isCatalogueLoading])
    return {
        getData,
        setData,
        dataCatalogue,
        isCatalogueLoading,
        isLoading
    }
}

export default useGetDataFrontEnd