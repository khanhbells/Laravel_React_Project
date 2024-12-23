import axios from "@/configs/axios";
import { PayloadInput, User } from "@/types/User";
import { baseSave } from "./BaseService";

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

const getUserById = async (userId: string | null): Promise<User> => {
    const response = await axios.get(`users/${userId}`)
    return response.data
}

export {
    pagination,
    save,
    getUserById
}