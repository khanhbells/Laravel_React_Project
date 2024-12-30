//REACT
import React from "react";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK


const breadcrumb = {

    index: {
        title: 'Quản lý nhóm thành viên',
        route: '/user/index'
    },
    create: {
        title: 'Thêm mới nhóm thành viên',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'user_catalogues'

interface tableColumn {
    name: string,
    render: (item: UserCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Tên nhóm thành viên',
        render: (item: UserCatalogue) => <span>{item.name}</span>
    },

    {
        name: 'Số lượng',
        render: (item: UserCatalogue) => <span className="">{item.users_count}</span>
    },
    {
        name: 'Mô tả',
        render: (item: UserCatalogue) => <span>{item.description}</span>
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
        }
    },
    {
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]',
        method: 'delete',
        params: ['id', 'handleAlertDialog:f', 'destroy:f'],
        onClick: (id: string, handleAlertDialog: any, destroy: any) => {
            handleAlertDialog(id, destroy)
            // confirmAction(destroy)
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



export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
    extraFilterItems,
}