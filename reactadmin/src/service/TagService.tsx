import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { UserCatalogue, UserCataloguePayloadInput } from "@/interfaces/types/UserCatalogueType";

interface ITag {
    name: string,
    canonical: string,
    meta_title: string,
    meta_keyword: string,
    meta_description: string

}

const endpoint = 'tags'

const pagination = async (queryString: string) => {
    const response = await axios.get(`/${endpoint}?${queryString}`)
    return response.data
}

const save = async (payload: ITag, updateParams: { action: string, id: string | undefined }) => {
    // return baseSave(`/${endpoint}`, payload, updateParams)
}

const update = async (payload: ITag) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {


    return baseDestroy(id, `${endpoint}`)

}

const getTagById = async (id: string | undefined): Promise<ITag> => {
    const response = await axios.get(`${endpoint}/${id}`)
    return response.data
}

export {
    pagination,
    save,
    getTagById,
    destroy,
}