import axiosInstance from "../configs/axios";
import { handleAxiosError, handleAxiosSuccess } from "../helper/axiosHelper";
import { User, PayloadInput } from "../types/User";
import { CustomAxiosRequestConfig } from "../configs/axios";
import { IForgotPassword } from "@/interfaces/ForgotPasswordInterface";
import { baseSave } from "./BaseService";
type LoginPayload = {
    email: string,
    password: string
}
type TForgotPasswordResponse = {
    [key: string]: any
}

const login = async (payload: LoginPayload): Promise<User | null> => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email: payload.email,
            password: payload.password
        })
        return response.data.user;

    } catch (error) {

        handleAxiosError(error)
        return null
    }
}

const signUp = async (payload: PayloadInput, updateParams: { action: string, id: string | undefined }) => {
    return baseSave('/auth/sign_up', payload, updateParams)
}

const forgotPassword = async (payload: IForgotPassword): Promise<TForgotPasswordResponse | null> => {

    try {
        const response = await axiosInstance.post('/auth/forgot_password', {
            email: payload.email,
        })
        handleAxiosSuccess(response.data.message)
        return response.data;

    } catch (error) {

        handleAxiosError(error)
        return null
    }
}


const changePassword = async (payload: { password: string, confirmPassword: string }, token: string | null, email: string | null) => {
    try {

        const response = await axiosInstance.put(`auth/reset_password`, {
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

const fetchUser = async (): Promise<User | null> => {

    try {
        const response = await axiosInstance.get('/auth/me', {
            guard: 'user'
        } as CustomAxiosRequestConfig)
        return response.data.user

    } catch (error) {
        return null
    }
}


export { login, signUp, fetchUser, forgotPassword, changePassword }