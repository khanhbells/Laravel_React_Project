import axios from "@/configs/axios";
import { baseDestroy } from "./BaseService";
import { baseSave } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { useNavigate } from "react-router-dom";
export interface ISystem {
    [key: string]: any
}

const endpoint = 'systems'

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

const save = async (payload: ISystem, updateParams: { action: string, id: string | undefined }) => {

    const payloadSubmit = payload.config


    return baseSave(`/${endpoint}`, payloadSubmit, updateParams)
}

const update = async (payload: ISystem) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {


    return baseDestroy(id, `${endpoint}`)

}

const findById = async (id: string | undefined): Promise<ISystem> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    destroy,
    findById,
    pagination,
    save
};
