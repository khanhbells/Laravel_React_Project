import axios from "../configs/axios";
import { User } from "../types/User";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
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

interface tableColumn {
    name: string,
    render: (item: User) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: User) => <span>{item.id}</span>
    },
    {
        name: 'Họ tên',
        render: (item: User) => <span>{item.name}</span>
    },

    {
        name: 'Số điện thoại',
        render: (item: User) => <span>{item.phone}</span>
    },
    {
        name: 'Email',
        render: (item: User) => <span>{item.email}</span>
    },
    {
        name: 'Địa chỉ',
        render: (item: User) => <span>{item.address ?? '-'}</span>
    },
    {
        name: 'Nhóm thành viên',
        render: (item: User) => <span>{'-'}</span>
    },

]

const buttonActions = [
    {
        path: '/user/update',
        icon: <FaRegEdit className="text-white" />,
        className: 'flex mr-[5px]'
    },
    {
        path: '/user/delete',
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]'
    },
    {
        path: '/user/reset',
        icon: <MdOutlineLockReset className="text-white text-[20px]" />,
        className: 'bg-[#f8ac59]'
    },
]
export {
    pagination,
    breadcrumb,
    model,
    tableColumn,
    buttonActions
}