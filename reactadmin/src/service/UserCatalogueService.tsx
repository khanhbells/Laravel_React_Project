import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { UserCatalogue, UserCataloguePayloadInput } from "@/interfaces/types/UserCatalogueType";

const endpoint = 'user_catalogues'

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

const save = async (payload: UserCataloguePayloadInput, updateParams: { action: string, id: string | undefined }) => {
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

const getUserCatalogueById = async (id: string | undefined): Promise<UserCatalogue> => {
    const response = await axios.get(`user_catalogues/${id}`)
    return response.data
}

export {
    pagination,
    save,
    getUserCatalogueById,
    destroy,
}