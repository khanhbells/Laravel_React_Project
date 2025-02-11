import axios from "@/configs/axios";
import { PayloadInput, User } from "@/types/User";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";

const endpoint = 'users'

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

const save = async (payload: PayloadInput, updateParams: { action: string, id: string | undefined }) => {
    return baseSave('/users', payload, updateParams)
}


const update = async (payload: PayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {

    console.log(id, 'users');

    return baseDestroy(id, 'users')

}

const getUserById = async (userId: string | undefined): Promise<User> => {
    const response = await axios.get(`users/${userId}`)
    return response.data
}

const changePassword = async (id: string, payload: { password: string, confirmPassword: string }) => {
    try {

        const response = await axios.put(`users/${id}/reset-password`, {
            password: payload.password,
            confirmPassword: payload.confirmPassword,
        })

        return response.data


    } catch (error) {
        handleAxiosError(error)
        return error
    }
}

export {
    pagination,
    save,
    getUserById,
    destroy,
    changePassword,
}