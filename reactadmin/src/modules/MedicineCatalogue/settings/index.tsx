//REACT
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
//SETTINGS
import { MedicineCatalogue } from "@/interfaces/types/MedicineCatalogueType";
import { formatCatalogueName } from "@/helper/myHelper";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//SERVICE
import { sort } from "@/service/BaseService";
//HOOK
import useDebounce from "@/hook/useDebounce";


const model = 'medicine_catalogues'
export const redirectIfSucces = '/medicine/catalogue/index'

const breadcrumb = {

    index: {
        title: 'Quản lý loại thuốc',
        route: '/medicine/catalogue/index'
    },
    create: {
        title: 'Thêm mới loại thuốc',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/medicine/catalogue/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/medicine/catalogue/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: MedicineCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Tên loại thuốc',
        render: (item: MedicineCatalogue) => <span><Link to={`/medicine/index?medicine_catalogue_id=${item.id}`}>
            {formatCatalogueName(item)}</Link></span>
    },

    {
        name: 'Số lượng',
        render: (item: MedicineCatalogue) => <span className="">{item.medicines_count ?? 0}</span>
    },
    {
        name: 'Sắp xếp',
        render: (item: MedicineCatalogue) => {
            const { debounce } = useDebounce()

            const debounceSort = debounce((value: string) => sort(item.id, model, value))

            return (
                <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => debounceSort(e.target.value)}
                    type="text"
                    defaultValue={item.order}
                    className="w-[50px] text-center"
                />
            )
        }
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
        path: '/medicine/catalogue/update/'
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
        id: 'medicine_catalogue_Id',
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