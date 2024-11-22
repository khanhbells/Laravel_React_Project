import axios from "axios";

//Cấu hình dữ liệu trả về
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

//Cấu hình mặc định api khi gửi dữ liệu
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost/laravelreact/public/api/v1/'
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios

//Cấu hình axios mặc định khi gửi dữ liệu
// const axiosInstance = axios.create({
//     baseURL: 'http://localhost/laravelreact/public/api/v1/',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//         'withCredentials': true,
//     }
// })