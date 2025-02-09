import axios from "axios";
import { showToast } from "./myHelper";
import { toast } from "react-toastify";
const handleAxiosError = (error: unknown) => {
    console.log(error);

    if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);

        showToast(error.response?.data.message, 'error')
    }
    else {
        showToast('Tài khoản hoặc mật khẩu không đúng', 'error')
    }

}
export { handleAxiosError }