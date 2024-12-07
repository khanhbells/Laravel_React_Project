import axios from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";
import { updateStatusByFieldParam } from "@/interfaces/BaseServiceInterface";
const updateStatusByField = async ({ id, value, column, model }: updateStatusByFieldParam) => {
    try {
        const response = await axios.put(`/${model}/${id}/status`, { value, column })

    } catch (error) {
        handleAxiosError(error)
    }
}

const deleteAll = async (ids: string[], model: string, refetch: any) => {
    try {

        const response = await axios.delete('records/delete/batch', {
            data: {
                ids, model
            }
        })
        refetch()
        return response.data

    } catch (error) {
        handleAxiosError(error)
    }
}

const updateFieldByParams = async (action: string, ids: string[], model: string, selectedValue: string, refetch: any) => {
    try {
        const response = await axios.put('records/update/batch', {
            ids: ids,
            model: model,
            field: action,
            value: selectedValue
        })
        refetch()
        return response.data

    } catch (error) {
        handleAxiosError(error)
    }
}

export { updateStatusByField, updateFieldByParams, deleteAll }