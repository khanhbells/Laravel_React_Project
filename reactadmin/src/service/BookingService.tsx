import axios from "@/configs/axios";
import { baseDestroy } from "./BaseService";
import { baseSave } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { useNavigate } from "react-router-dom";
export interface IBooking {
    name: string,
    canonical: string,
    [key: string]: string | undefined
}

const endpoint = 'frontend/bookings'

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

const update = async (payload: IBooking) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {


    return baseDestroy(id, `${endpoint}`)

}

const getBookingById = async (id: string | undefined): Promise<IBooking> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    destroy,
    getBookingById,
    pagination,
    save
};
