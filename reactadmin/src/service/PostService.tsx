import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { PostPayloadInput, Post, Tag, PostPayloadForSubmit } from "@/interfaces/types/PostType";

const endpoint = 'posts'

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

const save = async (payload: PostPayloadInput, updateParams: { action: string, id: string | undefined }) => {

    const payloadSubmit: PostPayloadForSubmit = {
        ...payload,
        tags: payload.tags ? payload.tags.map((tag: Tag) => tag.value) : undefined
    }

    return baseSave(endpoint, payloadSubmit, updateParams)
}

const update = async (payload: PostPayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<Post> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    findById,
    destroy,
}