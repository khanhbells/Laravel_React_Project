
import React from "react";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import { getInitialName } from "@/helper/myHelper";
import { Sheet } from "@/hook/useSheet";
import Recovery from "@/pages/user/user/Recovery";

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

export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
}