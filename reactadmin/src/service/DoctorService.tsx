import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { DoctorPayloadInput, Doctor, TagSpecialty, DoctorPayloadForSubmit } from "@/interfaces/types/DoctorType";
import { Navigate } from "react-router-dom";

const endpoint = 'doctors'

const pagination = async (queryString: string) => {
    try {
        const response = await axios.get(`/users?&user_catalogue_id=2&${queryString}`)
        return response.data
    } catch (error: any) {
        handleAxiosError(error)
        return {
            code: error?.response.status,
            message: 'Không có quyền truy cập',
        };
    }
}

const save = async (payload: DoctorPayloadInput, updateParams: { action: string, id: string | undefined }) => {

    const payloadSubmit: DoctorPayloadForSubmit = {
        ...payload,
        tags: payload.tags ? payload.tags.map((tag: TagSpecialty) => tag.value) : undefined,
        specialties: payload.specialties ? payload.specialties.map((specialty: TagSpecialty) => specialty.value) : undefined
    }

    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: DoctorPayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<Doctor> => {
    try {
        const response = await axios.get(`${endpoint}/${id}`)
        return response.data
    } catch (error: any) {
        handleAxiosError(error)
        return {
            code: error?.response.status,
            message: 'Không có quyền truy cập',
        };
    }
}


export {
    pagination,
    save,
    findById,
    destroy,
}