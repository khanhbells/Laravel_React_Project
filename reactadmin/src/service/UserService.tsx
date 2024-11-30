import axios from "../configs/axios";
import { handleAxiosError } from "../helper/axiosHelper";

const pagination = async () => {
    const response = await axios.get('/users?page=10')
    return response.data
}

export { pagination }