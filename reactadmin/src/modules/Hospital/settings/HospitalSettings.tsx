//REACT
import React from "react";
//COMPONENTS
import { Input } from "@/components/ui/input";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { Hospital } from "@/interfaces/types/HospitalType";
//INTERFACE & TYPE
import { ActionParam, ButtonAction, OpenSheetFunction, Select } from "@/interfaces/BaseServiceInterface";
//SERVICE
import { sort } from "@/service/BaseService";
//HOOK
import useDebounce from "@/hook/useDebounce";


const model = 'hospitals'
export const redirectIfSucces = '/hospital/index'

const breadcrumb = {

    index: {
        title: 'Quản lý bệnh viện',
        route: '/hospital/index'
    },
    create: {
        title: 'Thêm mới bệnh viện',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/hospital/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/hospital/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: Hospital) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Bệnh viện',
        render: (item: Hospital) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img className=" object-cover h-[60px] w-[100px] rounded cursor-pointer" src={item.image} alt="" />
                </div>
                <div>
                    <div className="name">
                        <span>{item.name}</span>
                        <div className="catalogues-name">
                            <span className="mr-[5px] text-[blue] text-[12px]">Chuyên khoa:</span>
                            {Array.isArray(item.specialties) && item.specialties.map((specialty: { label: string, value: string }) =>
                                <span key={specialty.value} className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] bg-[gray] text-[10px]">{specialty.label}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    },

    {
        name: 'Địa chỉ',
        render: (item: Hospital) => <span className="">{item.address ?? ''}</span>
    },
    {
        name: 'Sắp xếp',
        render: (item: Hospital) => {
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
        path: '/hospital/update/'
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
        placeholder: 'Chọn bệnh viện',
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
    breadcrumb, buttonActions,
    extraFilterItems, model,
    tableColumn
};
