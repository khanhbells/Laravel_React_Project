import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { PostCataloguePayloadInput, PostCatalogue } from "@/interfaces/types/PostCatalogueType";

const endpoint = 'posts'

const pagination = async (queryString: string) => {
    const response = await axios.get(`/${endpoint}?${queryString}`)
    return response.data
}

const save = async (payload: PostCataloguePayloadInput, updateParams: { action: string, id: string | undefined }) => {
    return baseSave(endpoint, payload, updateParams)
}

const update = async (payload: PostCataloguePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {
    return baseDestroy(id, endpoint)
}

const findById = async (id: string | undefined): Promise<PostCatalogue> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    findById,
    destroy,
}