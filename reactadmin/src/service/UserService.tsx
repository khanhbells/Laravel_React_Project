import axios from "../configs/axios";
import { User } from "../types/User";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
// import { handleAxiosError } from "../helper/axiosHelper";

const pagination = async (queryString: string) => {
    const response = await axios.get(`/users?${queryString}`)
    return response.data
}

const create = async (payload: any) => {
    console.log(123);

}


const breadcrumb = {

    index: {
        title: 'Quản lý thành viên',
        route: '/user/index'
    }, create: {
        title: 'Thêm mới thành viên',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/user/create'
    }

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

const validation = (password: any) => [
    {
        label: "Họ tên *",
        name: "name",
        type: "text",
        rules: {
            required: 'Bạn chưa nhập vào Họ tên'
        }
    },
    {
        label: "Email *",
        name: "email",
        type: "text",
        rules: {
            required: 'Bạn chưa nhập vào Email',
            pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email nhập vào không đúng định dạng"
            }
        }
    },
    {
        label: "Điện thoại *",
        name: "phone",
        type: "text",
        rules: {
            required: 'Bạn chưa nhập vào điện thoại'
        }
    },
    {
        label: "Mật khẩu (*)",
        name: "password",
        type: "password",
        rules: {
            required: 'Bạn chưa nhập vào mật khẩu'
        }
    },
    {
        label: "Nhập lại mk (*)",
        name: "re_password",
        type: "password",
        rules: {
            required: 'Bạn chưa nhập lại mật khẩu',
            validate: (value: any) => value === password.current || 'Mật khẩu không khớp'
        }
    },
    {
        label: "Ngày sinh",
        name: "birthday",
        type: "date"
    },
]

export {
    pagination,
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
    create,
    validation
}