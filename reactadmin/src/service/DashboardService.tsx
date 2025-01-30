import axios from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";


const statistic = async () => {
    try {
        const response = await axios.get(`statistic`)
        return response.data
    } catch (error: any) {
        handleAxiosError(error)
        return {
            code: error?.response.status,
            message: 'Không có quyền truy cập',
        };
    }
}


export {
    statistic
};
