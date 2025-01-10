import axios from "@/configs/axios";
import { baseDestroy } from "./BaseService";
import { baseSave } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";

export interface IPermission {
    name: string,
    canonical: string,
    [key: string]: string | undefined
}

const endpoint = 'permissions'

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

const save = async (payload: IPermission, updateParams: { action: string, id: string | undefined }) => {


    return baseSave(`/${endpoint}`, payload, updateParams)
}

const update = async (payload: IPermission) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {


    return baseDestroy(id, `${endpoint}`)

}

const getPermissionById = async (id: string | undefined): Promise<IPermission> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    destroy, getPermissionById, pagination,
    save
};
