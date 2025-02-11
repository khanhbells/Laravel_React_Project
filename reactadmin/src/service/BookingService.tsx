import axios from "@/configs/axios";
import { baseDestroy } from "./BaseService";
import { baseSave } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { useNavigate } from "react-router-dom";
import { BookingMedicinePayloadInput, BookingPayloadForSubmit } from "@/interfaces/types/BookingMedicineType";
export interface IBooking {
    [key: string]: string | undefined
}

const endpoint = 'bookings'

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

const save = async (payload: IBooking, updateParams: { action: string, id: string | undefined }) => {
    return baseSave(`/${endpoint}`, payload, updateParams)
}

const saveBookingMedicine = async (payload: BookingMedicinePayloadInput, updateParams: { action: string, id: string | undefined }, endpoint?: string): Promise<any> => {
    const payloadSubmit: BookingPayloadForSubmit = {
        ...payload,
        medicines: JSON.stringify(payload.medicines)
    }

    return baseSave(`${endpoint}`, payloadSubmit, updateParams)
}
const destroy = async (id: string) => {


    return baseDestroy(id, `${endpoint}`)

}

const getBookingById = async (id: string | undefined, queryParams: Record<string, string> = {}): Promise<IBooking> => {
    const response = await axios.get(`frontend/${endpoint}/${id}`, { params: queryParams })
    return response.data
}

export {
    destroy,
    getBookingById,
    pagination,
    save,
    saveBookingMedicine
};
