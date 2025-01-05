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

const getLocationData = async (locationType: string, parentId: string | undefined) => {
    const response = await axios.get(`/location?locationType=${locationType}${parentId !== undefined ? `&parent_id=${parentId}` : ''}`)
    return response.data
}

export interface PayloadInput<T> {
    [key: string]: T
}

const baseSave = async<T,>(apiUrl: string, payload: PayloadInput<T>, updateParams: { action: string, id: string | undefined }) => {
    console.log(payload);

    const formData = new FormData()
    const keys = Object.keys(payload) as Array<keyof PayloadInput<T>>
    let hasFile = false

    keys.forEach((key) => {
        const value = payload[key]
        if (value instanceof FileList && value.length > 0) {
            if (value.length === 1) {
                formData.append(key as string, value[0])
            }
            else {
                for (let i = 0; i < value.length; i++) {
                    formData.append(`${key}[]`, value[i])
                }
            }
            hasFile = true
        } else if (value instanceof File) {
            formData.append(key as string, value)
            hasFile = true
        } else {
            formData.append(key as string, String(value))
        }
    })

    if (updateParams.action === 'update' && updateParams.id) {
        formData.append('_method', 'PUT')
        apiUrl = `${apiUrl}/${updateParams.id}`
    }

    const headers: HeadersInit = {}

    if (hasFile) {
        headers['Content-Type'] = 'multipart/form-data'
    }

    const response = await axios.post(apiUrl, formData, {
        headers: headers
    })
    return response.data

}


const baseDestroy = async (id: string, model: string) => {
    const apiUrl = `${model}/${id}`
    const response = await axios.delete(apiUrl)
    return response.data

}

export {
    updateStatusByField,
    updateFieldByParams,
    deleteAll,
    getLocationData,
    baseSave,
    baseDestroy
}