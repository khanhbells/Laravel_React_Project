import axios from "@/configs/axios";
import { baseDestroy } from "../BaseService";
import { baseSave } from "../BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { useNavigate } from "react-router-dom";
import { PayloadBookingInput } from "@/interfaces/types/BookingType";
export interface GetFrontEnd {
    [key: string]: any
}

// const endpoint = 'frontend/specialty_catalogues'

const pagination = async (queryString: string, endpoint: string) => {
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
const menus = async (queryString: string, endpoint: string) => {
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
const systems = async (queryString: string, endpoint: string) => {
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

const searchInput = async (queryString: string, endpoint: string) => {
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

const save = async (payload: GetFrontEnd, updateParams: { action: string, id: string | undefined }, endpoint?: string): Promise<any> => {
    return baseSave(`${endpoint}`, payload, updateParams)
}


const findById = async (id: string | undefined, endpoint: string): Promise<GetFrontEnd> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    save,
    findById,
    pagination,
    menus,
    searchInput,
    systems
};
