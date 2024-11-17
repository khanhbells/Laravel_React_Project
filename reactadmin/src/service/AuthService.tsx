import axiosInstance from "../configs/axios";

type LoginPayload = {
    email: string,
    password: string
}

const login = async (payload: LoginPayload) => {
    try {
        const response = axiosInstance.post('/login')
        console.log(response);
    } catch (error) {
        console.log(error);

    }
}


export { login }