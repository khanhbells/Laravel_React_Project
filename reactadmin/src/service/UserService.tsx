import axios from "../configs/axios";
// import { handleAxiosError } from "../helper/axiosHelper";

const pagination = async (page: number | null) => {

    const response = await axios.get(`/users?page=${page}`)
    return response.data
}



const breadcrumb = {
    title: 'Quản lý thành viên',
    route: '/user/index'
}

const model = 'users'

export { pagination, breadcrumb, model }