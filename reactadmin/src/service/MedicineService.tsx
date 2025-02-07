import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { MedicinePayloadInput, Medicine, Tag, MedicinePayloadForSubmit } from "@/interfaces/types/MedicineType";

const endpoint = 'medicines'

const pagination = async (queryString: string) => {
    try {
        const response = await axios.get(`/${endpoint}?${queryString}`)
        return response.data
    } catch (error: any) {
        handleAxiosError(error)
        return {
            code: error?.response.status,
            message: 'Không có quyền truy cập',
        };
    }
}

const save = async (payload: MedicinePayloadInput, updateParams: { action: string, id: string | undefined }) => {

    const payloadSubmit: MedicinePayloadForSubmit = {
        ...payload,
        tags: payload.tags ? payload.tags.map((tag: Tag) => tag.value) : undefined
    }

    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: MedicinePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<Medicine> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    findById,
    destroy,
}