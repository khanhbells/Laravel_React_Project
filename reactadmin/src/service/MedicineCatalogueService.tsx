import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { MedicineCataloguePayloadInput, MedicineCatalogue } from "@/interfaces/types/MedicineCatalogueType";

const endpoint = 'medicine_catalogues'

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

const save = async (payload: MedicineCataloguePayloadInput, updateParams: { action: string, id: string | undefined }) => {
    return baseSave(endpoint, payload, updateParams)
}

const update = async (payload: MedicineCataloguePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const getMedicineCatalogueById = async (id: string | undefined): Promise<MedicineCatalogue> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    getMedicineCatalogueById,
    destroy,
}