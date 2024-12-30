import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType";
import { UserCataloguePayloadInput } from "@/interfaces/types/UserCatalogueType";

const pagination = async (queryString: string, action: string) => {
    const response = await axios.get(`/user_catalogues?${queryString}`)
    return response.data
}

const save = async (payload: UserCataloguePayloadInput, updateParams: { action: string, id: string | null }) => {
    return baseSave('/user_catalogues', payload, updateParams)
}

const update = async (payload: UserCataloguePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {

    console.log(id, 'user_catalogues');

    return baseDestroy(id, 'user_catalogues')

}

const getUserCatalogueById = async (id: string | null): Promise<UserCatalogue> => {
    const response = await axios.get(`user_catalogues/${id}`)
    return response.data
}

export {
    pagination,
    save,
    getUserCatalogueById,
    destroy,
}