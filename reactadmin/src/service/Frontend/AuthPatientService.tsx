import axiosInstance from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";
import { Patient } from "@/types/Patient";
import { CustomAxiosRequestConfig } from "@/configs/axios";
import { ForgotPassword } from "@/components/Frontend/Section/Login/ForgotPassword";

type LoginPayload = {
    email: string,
    password: string
}
type TForgotPasswordResponse = {
    [key: string]: any
}

const login = async (payload: LoginPayload): Promise<Patient | null> => {
    try {
        const response = await axiosInstance.post('/patient/login', {
            email: payload.email,
            password: payload.password
        })
        return response.data.patient;

    } catch (error) {

        handleAxiosError(error)
        return null
    }
}

const forgotPassword = async (payload: ForgotPassword): Promise<TForgotPasswordResponse | null> => {
    try {
        const response = await axiosInstance.post('/patient/forgot_password', {
            email: payload.email,
        })

        return response.data;

    } catch (error) {

        handleAxiosError(error)
        return null
    }
}

const changePassword = async (payload: { password: string, confirmPassword: string }, token: string | null, email: string | null) => {
    try {

        const response = await axiosInstance.put(`patient/reset_password`, {
            password: payload.password,
            confirmPassword: payload.confirmPassword,
            token,
            email
        })

        return response.data


    } catch (error) {
        handleAxiosError(error)
        return error
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


export { login, fetchPatient, logout, forgotPassword, changePassword }