//REACT
import React from "react";
//COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import Recovery from "@/pages/user/user/Recovery";
import { FaXmark } from "react-icons/fa6"
import { IoCheckmarkSharp } from "react-icons/io5";
import { AiOutlineStop } from "react-icons/ai";
//SETTINGS
import { getInitialName } from "@/helper/myHelper";
import { User } from "@/types/User";
//INTERFACE & TYPE
import { BaseFilterItem } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK
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

export type Row = Record<string, any>
export type OpenSheetFunction = (sheet: Sheet) => void
export type ActionParam = keyof Row | `${string}:f` | `${string}:c` | `${string}:pf` // pf: prop function:

export type ParamToType<T extends ActionParam> =
    T extends `${string}:f` ? Function :
    T extends `${string}:pf` ? Function :
    T extends `${string}:c` ? React.ComponentType<any> :
    T extends keyof Row ? Row[T] :
    never;
export type ParamsToTuple<T extends ActionParam[]> = {
    [K in keyof T]: ParamToType<T[K]>
}

export interface ButtonAction<T extends ActionParam[]> {
    params?: T,
    className: string,
    icon?: React.ReactNode,
    path?: string,
    method?: string,
    onClick?: (...agrs: ParamsToTuple<T>) => void,
    component?: React.ComponentType<any>
}

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


const filterItems: BaseFilterItem[] = [
    {
        value: 'deleteAll',
        label: 'Xóa',
        icon: <FaXmark className="mr-[5px]" />
    },
    {
        value: 'publish|2',
        label: 'Xuất bản',
        icon: <IoCheckmarkSharp className="mr-[5px]" />
    },
    {
        value: 'publish|1',
        label: 'Ngừng xuất bản',
        icon: <AiOutlineStop className="mr-[5px]" />
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

export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
    extraFilterItems,
    filterItems
}