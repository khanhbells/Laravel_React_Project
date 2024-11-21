import axios from "axios";

//Cấu hình axios mặc định khi gửi dữ liệu
const axiosInstance = axios.create({
    baseURL: 'http://localhost/laravelreact/public/api/v1/',
    headers: {
        'Content-Type': 'application/json'
    }
})

//Cấu hình dữ liệu trả về
axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        // const { response } = error
        // if (response.status === 401) {
        //     // refresh token ở đây
        // }

        return Promise.reject(error)
    }
)

export default axiosInstance