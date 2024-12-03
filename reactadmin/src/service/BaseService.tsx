import axios from "../configs/axios";
import { handleAxiosError } from "../helper/axiosHelper";
import { updateStatusByFieldParam } from "../interfaces/BaseServiceInterface";
const updateStatusByField = async ({ id, value, column, model }: updateStatusByFieldParam) => {
    try {
        const response = await axios.put(`/${model}/${id}/status`, { value, column })

    } catch (error) {
        handleAxiosError(error)
    }
}

export { updateStatusByField }