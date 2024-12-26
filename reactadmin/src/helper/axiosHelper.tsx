import axios from "axios";
import { showToast } from "./myHelper";
import { toast } from "react-toastify";
const handleAxiosError = (error: unknown) => {

    if (axios.isAxiosError(error)) {
        showToast(error.response?.data.message, 'error')
    } else {
        showToast('Đã xảy ra lỗi không được xác định. Hãy thử lại sau', 'error')
    }

}
export { handleAxiosError }