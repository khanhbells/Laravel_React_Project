import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { SpecialtyCataloguePayloadInput, SpecialtyCatalogue } from "@/interfaces/types/SpecialtyCatalogueType";

const endpoint = 'specialty_catalogues'

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

const save = async (payload: SpecialtyCataloguePayloadInput, updateParams: { action: string, id: string | undefined }) => {
    // console.log(payload);

    return baseSave(endpoint, payload, updateParams)
}

const update = async (payload: SpecialtyCataloguePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const getSpecialtyCatalogueById = async (id: string | undefined): Promise<SpecialtyCatalogue> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    getSpecialtyCatalogueById,
    destroy,
}