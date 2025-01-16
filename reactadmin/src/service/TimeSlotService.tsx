import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { TimeSlot, TimeSlotPayloadInput } from "@/interfaces/types/TimeSlotType";
import dayjs from "dayjs";

const endpoint = 'time_slots'

const pagination = async (queryString: string) => {
    const response = await axios.get(`/${endpoint}?${queryString}`)
    return response.data
}

const save = async (payload: TimeSlotPayloadInput, updateParams: { action: string, id: string | undefined }) => {


    return baseSave('/time_slots', payload, updateParams)
}

const update = async (payload: TimeSlotPayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {

    console.log(id, 'time_slots');

    return baseDestroy(id, 'time_slots')

}

const findById = async (id: string | undefined): Promise<TimeSlot> => {
    const response = await axios.get(`time_slots/${id}`)
    return response.data
}



export {
    pagination,
    save,
    findById,
    destroy,
}