import axios from "@/configs/axios";
import { PayloadInput, Patient } from "@/types/Patient";
import { baseSave } from "./BaseService";
import { baseDestroy } from "./BaseService";
import { handleAxiosError } from "@/helper/axiosHelper";
import { showToast } from "@/helper/myHelper";

const endpoint = 'patients'

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

const save = async (payload: PayloadInput, updateParams: { action: string, id: string | undefined }) => {
    console.log(payload);

    return baseSave('/patients', payload, updateParams)
}

const update = async (payload: PayloadInput) => {
    //     header: {
    //         'Content-Type': 'multipart/form-data'
    //     }
}

const destroy = async (id: string) => {

    console.log(id, 'patients');

    return baseDestroy(id, 'patients')

}

const getPatientById = async (patientId: string | undefined): Promise<Patient> => {
    const response = await axios.get(`patients/${patientId}`)
    return response.data
}

const changePassword = async (id: string, payload: { password: string, confirmPassword: string }) => {
    try {

        const response = await axios.put(`patients/${id}/reset-password`, {
            password: payload.password,
            confirmPassword: payload.confirmPassword,
        })

        return response.data


    } catch (error) {
        handleAxiosError(error)
        return error
    }
}

export {
    pagination,
    save,
    getPatientById,
    destroy,
    changePassword
}