import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import { getInitialName } from "@/helper/myHelper";
import { Sheet } from "@/hook/useSheet";

const breadcrumb = {

    index: {
        title: 'Quản lý thành viên',
        route: '/user/index'
    },
    create: {
        title: 'Thêm mới thành viên',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'users'

interface tableColumn {
    name: string,
    render: (item: User) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'ID',
        render: (item: User) => (
            <div className="flex items-center">
                <Avatar className="mr-[15px] ml-[15px]">
                    {item.image ? <AvatarImage src={item.image} alt="avatar" /> : <AvatarFallback>{getInitialName(item.name)}</AvatarFallback>}
                </Avatar>
                <span>{item.name}</span>
            </div>
        )
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
        className: 'flex mr-[5px]',
        method: 'create',
        onClick: (id: string, openSheet: (sheet: Sheet) => void) => {
            openSheet({ open: true, action: 'update', id: id })
        }
    },
    {
        path: '/user/delete',
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]',
        method: 'delete'
    },
    {
        path: '/user/reset',
        icon: <MdOutlineLockReset className="text-white text-[20px]" />,
        className: 'bg-[#f8ac59]',
        method: 'reset'
    },
]

export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
}