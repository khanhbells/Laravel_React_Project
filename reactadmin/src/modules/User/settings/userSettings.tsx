//REACT
import React from "react";
//COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import Recovery from "@/modules/User/screens/include/Recovery";
//SETTINGS
import { getInitialName } from "@/helper/myHelper";
import { User } from "@/types/User";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK

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
        name: 'Avartar',
        render: (item: User) => (
            <div className="flex items-center">
                <Avatar className="mr-[15px] ml-[15px]">
                    {item.image ? <AvatarImage src={item.image} alt="avatar" /> : <AvatarFallback>{getInitialName(item.name)}</AvatarFallback>}
                </Avatar>
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



const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        path: '/user/update',
        icon: <FaRegEdit className="text-white" />,
        className: 'flex mr-[5px]',
        method: 'create',
        params: ['id', 'openSheet:f'],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'update', id: id })
        }
    },
    {
        path: '/user/delete',
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]',
        method: 'delete',
        params: ['id', 'handleAlertDialog:f', 'destroy:f'],
        onClick: (id: string, handleAlertDialog: any, destroy: any) => {
            handleAlertDialog(id, destroy)
            // confirmAction(destroy)
        }
    },
    {
        path: '/user/recovery',
        icon: <MdOutlineLockReset className="text-white text-[20px]" />,
        className: 'bg-[#f8ac59]',
        method: 'reset',
        params: ['id', 'changePassword:pf', 'handleDialog:f', 'Recovery:c'],
        component: Recovery,
        onClick: (id: string, changePassword: Function, handleDialog: Function, Recovery: React.ComponentType<any>) => {
            const params = {
                id: id
            }
            handleDialog(id, changePassword, Recovery)
        }
    },
]




const extraFilterItems: Select[] = [
    {
        id: 'user_catalogue_Id',
        placeholder: 'Chọn Nhóm Thành Viên',
        items: [
            {
                value: '0',
                label: 'Tất cả các nhóm'
            },
            {
                value: '1',
                label: 'Admin'
            }
        ]
    }
]

export const formField = (action: string, data?: User | undefined) => {
    const showPasswordField = action !== 'update'
    const baseField = [
        {
            label: "Họ tên *",
            name: "name",
            type: "text",
            value: data && data.name
        },
        {
            label: "Email *",
            name: "email",
            type: "text",
            value: data && data.email

        },
        {
            label: "Điện thoại *",
            name: "phone",
            type: "text",
            value: data && data.phone
        },
        {
            label: "Ngày sinh",
            name: "birthday",
            type: "date",
            value: data && data.birthday
        },
    ]

    const passwordFields = [
        {
            label: "Mật khẩu (*)",
            name: "password",
            type: "password",
            value: ''
        },
        {
            label: "Nhập lại mk (*)",
            name: "confirmPassword",
            type: "password",
            value: ''
        }
    ]

    return showPasswordField ? [...baseField, ...passwordFields] : baseField;
}

export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
    extraFilterItems,
}