import axios from "@/configs/axios";
import { PayloadInput, User } from "@/types/User";


const pagination = async (queryString: string) => {
    const response = await axios.get(`/users?${queryString}`)
    return response.data
}

const create = async (payload: PayloadInput) => {

    const formData = new FormData()

    const keys = Object.keys(payload) as Array<keyof PayloadInput>
    keys.forEach((key) => {
        const value = payload[key]
        if (value instanceof FileList && value.length > 0) {
            formData.append('image', value[0])
        } else {
            formData.append(key, String(value))
        }
    })
    console.log(formData);
    const response = await axios.post('/users', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

}

const getUserById = async (userId: string | null): Promise<User> => {
    const response = await axios.get(`users/${userId}`)
    return response.data
}

export {
    pagination,
    create,
    getUserById
}