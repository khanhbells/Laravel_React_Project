//REACT
import React from "react";
//COMPONENTS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import Recovery from "@/modules/Patient/screens/include/Recovery";
//SETTINGS
import { getInitialName } from "@/helper/myHelper";
import { Patient } from "@/types/Patient";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK
const breadcrumb = {

    index: {
        title: 'Quản lý bệnh nhân',
        route: '/patient/index'
    },
    create: {
        title: 'Thêm mới bệnh nhân',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'patients'

interface tableColumn {
    name: string,
    render: (item: Patient) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Avartar',
        render: (item: Patient) => (
            <div className="flex items-center">
                <Avatar className="mr-[15px] ml-[15px]">
                    {item.image ? <AvatarImage src={item.image} alt="avatar" /> : <AvatarFallback>{getInitialName(item.name)}</AvatarFallback>}
                </Avatar>
            </div>
        )
    },
    {
        name: 'Họ tên',
        render: (item: Patient) => <span>{item.name}</span>
    },

    {
        name: 'Số điện thoại',
        render: (item: Patient) => <span>{item.phone}</span>
    },
    {
        name: 'Email',
        render: (item: Patient) => <span>{item.email}</span>
    },
    {
        name: 'Địa chỉ',
        render: (item: Patient) => <span>{item.address ?? '-'}</span>
    },
    {
        name: 'Nhóm bệnh nhân',
        render: (item: Patient) => <span>{item.patient_catalogues ?? '-'}</span>
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
    {
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




const extraFilterItems: Select[] = [
    {
        id: 'patient_catalogue_Id',
        placeholder: 'Chọn Nhóm bệnh nhân',
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

export const formField = (action: string, data?: Patient | undefined) => {
    const showPasswordField = action !== 'update'
    const baseField = [
        {
            label: "Họ tên *",
            name: "name",
            type: "text",
            value: data && data.name
        },
        {
            label: "Email *",
            name: "email",
            type: "text",
            value: data && data.email

        },
        {
            label: "Điện thoại *",
            name: "phone",
            type: "text",
            value: data && data.phone
        },
        {
            label: "Ngày sinh",
            name: "birthday",
            type: "date",
            value: data && data.birthday
        },
    ]

    const passwordFields = [
        {
            label: "Mật khẩu (*)",
            name: "password",
            type: "password",
            value: ''
        },
        {
            label: "Nhập lại mk (*)",
            name: "confirmPassword",
            type: "password",
            value: ''
        }
    ]

    return showPasswordField ? [...baseField, ...passwordFields] : baseField;
}

export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
    extraFilterItems,
}