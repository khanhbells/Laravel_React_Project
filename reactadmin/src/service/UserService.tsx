import axios from "../configs/axios";
import { User } from "../types/User";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
// import { handleAxiosError } from "../helper/axiosHelper";
import { PayloadInput } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

//Myhepler
import { getInitialName } from "@/helper/myHelper";

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
export {
    pagination,
    create,
}