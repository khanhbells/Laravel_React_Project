import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { SchedulePayloadInput, Schedule, TimeSlot, SchedulePayloadForSubmit } from "@/interfaces/types/ScheduleType";

const endpoint = 'schedules'

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

const save = async (payload: SchedulePayloadInput, updateParams: { action: string, id: string | undefined }) => {
    const payloadSubmit: SchedulePayloadForSubmit = {
        ...payload,
        time_slots: JSON.stringify(payload.time_slots)
    }
    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: SchedulePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<Schedule> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    findById,
    destroy,
}