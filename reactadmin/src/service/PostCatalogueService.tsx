import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { PostCataloguePayloadInput, PostCatalogue } from "@/interfaces/types/PostCatalogueType";

const endpoint = 'post_catalogues'

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

const getPostCatalogueById = async (id: string | undefined): Promise<PostCatalogue> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}


export {
    pagination,
    save,
    getPostCatalogueById,
    destroy,
}