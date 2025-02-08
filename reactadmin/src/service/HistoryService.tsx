import axios from "@/configs/axios";
import { baseDestroy } from "./BaseService";
import { baseSave } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { useNavigate } from "react-router-dom";
export interface IHistory {
    [key: string]: string | undefined
}

const endpoint = 'patient/historys'

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


const getHistoryById = async (id: string | undefined): Promise<IHistory> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    getHistoryById,
    pagination,
};
