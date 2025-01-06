//REACT
import React from "react";
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
//HOOK


const model = 'post_catalogues'
export const redirectIfSucces = '/post/catalogue/index'

const breadcrumb = {

    index: {
        title: 'Quản lý nhóm bài viết',
        route: '/post/catalogue/index'
    },
    create: {
        title: 'Thêm mới nhóm bài viết',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/post/catalogue/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/post/catalogue/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: PostCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Tên nhóm bài viết',
        render: (item: PostCatalogue) => <span><Link to={`/post/index?post_catalogue_id=${item.id}`}>
            {formatCatalogueName(item)}</Link></span>
    },

    {
        name: 'Số lượng',
        render: (item: PostCatalogue) => <span className="">{item.posts_count}</span>
    },
    {
        name: 'Sắp xếp',
        render: (item: PostCatalogue) => <Input type="text" defaultValue={item.order} className="w-[50px] text-center" />
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
        path: '/post/catalogue/update/'
    },
    {
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]',
        method: 'delete',
        params: ['id', 'handleAlertDialog:f', 'destroy:f'],
        onClick: (id: string, handleAlertDialog: any, destroy: any) => {
            handleAlertDialog(id, destroy)
        }
    },
]




const extraFilterItems: Select[] = [
    {
        id: 'post_catalogue_Id',
        placeholder: 'Chọn Nhóm bài viết',
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