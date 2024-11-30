import axios from "../configs/axios";
import { handleAxiosError } from "../helper/axiosHelper";

const pagination = async () => {
    const response = await axios.get('/users')
    return response.data.users
}

export { pagination }