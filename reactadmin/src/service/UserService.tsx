import axios from "@/configs/axios";
import { PayloadInput, User } from "@/types/User";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";

const pagination = async (queryString: string, action: string) => {
    const response = await axios.get(`/users?${queryString}`)
    return response.data
}

const save = async (payload: PayloadInput, updateParams: { action: string, id: string | null }) => {
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

const getUserById = async (userId: string | null): Promise<User> => {
    const response = await axios.get(`users/${userId}`)
    return response.data
}

const changePassword = async (id: string, payload: { password: string, re_password: string }) => {
    try {

        const response = await axios.post(`users/${id}/reset-password`, {
            password: payload.password,
            re_password: payload.re_password,
            _method: 'PUT'
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
    changePassword
}