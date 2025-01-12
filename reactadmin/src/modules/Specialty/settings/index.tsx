//REACT
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
//SETTINGS
import { Specialty } from "@/interfaces/types/SpecialtyType";
import { formatCatalogueName } from "@/helper/myHelper";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//SERVICE
import { sort } from "@/service/BaseService";
//HOOK
import useDebounce from "@/hook/useDebounce";


const model = 'specialties'
export const redirectIfSucces = '/specialty/index'

const breadcrumb = {

    index: {
        title: 'Quản lý chuyên khoa',
        route: '/specialty/index'
    },
    create: {
        title: 'Thêm mới chuyên khoa',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/specialty/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/specialty/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: Specialty) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Chuyên khoa',
        render: (item: Specialty) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img className=" object-cover h-[60px] w-[100px] rounded cursor-pointer" src={item.image} alt="" />
                </div>
                <div>
                    <div className="name">
                        <span>{item.name}</span>
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
        render: (item: Specialty) => {
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
        path: '/specialty/update/'
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


export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
}