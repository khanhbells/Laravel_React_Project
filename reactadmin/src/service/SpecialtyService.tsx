import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { SpecialtyPayloadInput, Specialty, Array, SpecialtyPayloadForSubmit } from "@/interfaces/types/SpecialtyType";
import { log } from "node:console";

const endpoint = 'specialties'

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

const save = async (payload: SpecialtyPayloadInput, updateParams: { action: string, id: string | undefined }) => {


    const payloadSubmit: SpecialtyPayloadForSubmit = {
        ...payload,
        tags: payload.tags ? payload.tags.map((tag: Array) => tag.value) : undefined
    }
    console.log(payloadSubmit);


    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: SpecialtyPayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<Specialty> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    findById,
    destroy,
}