import axiosInstance from "../configs/axios";
import { handleAxiosError } from "../helper/axiosHelper";
import { User } from "../types/User";
import { useDispatch } from "react-redux";
import { setAuthLogin } from "../redux/slide/authSlice";

type LoginPayload = {
    email: string,
    password: string
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

const fetchUser = async (): Promise<User | null> => {

    try {
        const response = await axiosInstance.get('/auth/me')
        return response.data.user

    } catch (error) {
        return null
    }
}


export { login, fetchUser }