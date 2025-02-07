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


const model = 'medicines'
export const redirectIfSucces = '/medicine/index'

const breadcrumb = {

    index: {
        title: 'Quản lý thuốc',
        route: '/medicine/index'
    },
    create: {
        title: 'Thêm mới thuốc',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/medicine/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/medicine/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: MedicineCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Bài viết',
        render: (item: MedicineCatalogue) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img className=" object-cover h-[60px] w-[100px] rounded cursor-pointer" src={item.image} alt="" />
                </div>
                <div>
                    <div className="name">
                        <span><Link to={`/medicine/index?medicine_id=${item.id}`}>
                            {item.name}</Link></span>
                        <div className="catalogues-name">
                            <span className="mr-[5px] text-[blue] text-[12px]">Danh mục:</span>
                            {Array.isArray(item.cats) && item.cats.map((catItem: string) =>
                                <span key={catItem} className="cat-item-name mr-[10px] text-[#f00] text-[12px]">{catItem}</span>
                            )}
                        </div>
                        <div className="catalogues-name">
                            <span className="mr-[5px] text-[blue] text-[12px]">Tags:</span>
                            {Array.isArray(item.tags) && item.tags.map((tag: { label: string, value: string }) =>
                                <span key={tag.value} className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] bg-[gray] text-[10px]">{tag.label}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
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
        path: '/medicine/update/'
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
        placeholder: 'Chọn thuốc',
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