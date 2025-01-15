import axios from "@/configs/axios";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";
import { PatientCatalogue, PatientCataloguePayloadInput } from "@/interfaces/types/PatientCatalogueType";

const endpoint = 'patient_catalogues'

const pagination = async (queryString: string) => {
    const response = await axios.get(`/${endpoint}?${queryString}`)
    return response.data
}

const save = async (payload: PatientCataloguePayloadInput, updateParams: { action: string, id: string | undefined }) => {
    return baseSave('/patient_catalogues', payload, updateParams)
}

const update = async (payload: PatientCataloguePayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {

    console.log(id, 'patient_catalogues');

    return baseDestroy(id, 'patient_catalogues')

}

const getPatientCatalogueById = async (id: string | undefined): Promise<PatientCatalogue> => {
    const response = await axios.get(`patient_catalogues/${id}`)
    return response.data
}

export {
    pagination,
    save,
    getPatientCatalogueById,
    destroy,
}