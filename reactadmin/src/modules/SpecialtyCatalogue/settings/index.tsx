//REACT
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
//SETTINGS
import { SpecialtyCatalogue } from "@/interfaces/types/SpecialtyCatalogueType";
import { formatCatalogueName } from "@/helper/myHelper";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//SERVICE
import { sort } from "@/service/BaseService";
//HOOK
import useDebounce from "@/hook/useDebounce";


const model = 'specialty_catalogues'
export const redirectIfSucces = '/specialty/catalogue/index'

const breadcrumb = {

    index: {
        title: 'Quản lý nhóm dịch vụ khám',
        route: '/specialty/catalogue/index'
    },
    create: {
        title: 'Thêm mới nhóm dịch vụ khám',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/specialty/catalogue/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/specialty/catalogue/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: SpecialtyCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Tên nhóm dịch vụ khám',
        render: (item: SpecialtyCatalogue) => <span><Link to={`/specialty/index?specialty_catalogue_id=${item.id}`}>
            {formatCatalogueName(item)}</Link></span>
    },

    {
        name: 'Số lượng',
        render: (item: SpecialtyCatalogue) => <span className="">{item.specialtys_count ?? 0}</span>
    },
    {
        name: 'Sắp xếp',
        render: (item: SpecialtyCatalogue) => {
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
        path: '/specialty/catalogue/update/'
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
        id: 'specialty_catalogue_Id',
        placeholder: 'Chọn Nhóm dịch vụ khám',
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