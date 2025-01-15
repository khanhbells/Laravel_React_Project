//REACT
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
//SETTINGS
import { PostCatalogue } from "@/interfaces/types/PostCatalogueType";
import { formatCatalogueName } from "@/helper/myHelper";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//SERVICE
import { sort } from "@/service/BaseService";
//HOOK
import useDebounce from "@/hook/useDebounce";
import { User } from "@/types/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitialName } from "@/helper/myHelper";

const model = 'doctors'
export const redirectIfSucces = '/user/doctor/index'

const breadcrumb = {

    index: {
        title: 'Quản lý bác sĩ',
        route: '/user/doctor/index'
    },
    create: {
        title: 'Quản lý bác sĩ',
        route: '/user/doctor/index'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/doctor/update/:id'
    },

}


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

]



const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        icon: <FaRegEdit className="text-white" />,
        className: 'flex mr-[5px]',
        method: 'create',
        params: ['id', 'openSheet:f'],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'update', id: id })
        },
        path: '/user/doctor/update/'
    },
]




const extraFilterItems: Select[] = [
    {
        id: 'doctor_catalogue_Id',
        placeholder: 'Chọn bác sĩ',
        items: [
            {
                value: '0',
                label: 'Tất cả'
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
}