import axios from "axios";
import { showToast } from "./myHelper";
import { toast } from "react-toastify";
const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        showToast(error.response?.data.message, 'error')
    }
    else {
        showToast('Tài khoản đã đăng xuất', 'error')
    }

}
export { handleAxiosError }