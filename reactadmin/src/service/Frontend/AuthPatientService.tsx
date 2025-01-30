import axiosInstance from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";
import { Patient } from "@/types/Patient";
import { CustomAxiosRequestConfig } from "@/configs/axios";

type LoginPayload = {
    email: string,
    password: string
}

const login = async (payload: LoginPayload): Promise<Patient | null> => {
    try {
        const response = await axiosInstance.post('/patient/login', {
            email: payload.email,
            password: payload.password
        })
        console.log(response);

        return response.data.patient;

    } catch (error) {

        handleAxiosError(error)
        return null
    }
}

const fetchPatient = async (): Promise<Patient | null> => {

    try {
        const response = await axiosInstance.get('/patient/me', {
            guard: 'patient'
        } as CustomAxiosRequestConfig)
        return response.data.patient

    } catch (error) {
        return null
    }
}

const logout = async () => {
    try {
        const response = await axiosInstance.get('/patient/logout')
        return response
    } catch (error) {
        handleAxiosError(error)
    }
}


export { login, fetchPatient, logout }