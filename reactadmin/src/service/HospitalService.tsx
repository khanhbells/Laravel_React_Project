import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { HospitalPayloadInput, Hospital, Specialty, SpecialtyPayloadForSubmit } from "@/interfaces/types/HospitalType";

const endpoint = 'hospitals'

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

const save = async (payload: HospitalPayloadInput, updateParams: { action: string, id: string | undefined }) => {
    const payloadSubmit: SpecialtyPayloadForSubmit = {
        ...payload,
        specialties: payload.specialties ? payload.specialties.map((specialty: Specialty) => specialty.value) : undefined
    }
    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: HospitalPayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const getHospitalById = async (id: string | undefined): Promise<Hospital> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    getHospitalById,
    destroy,
}