//REACT
import React from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { PatientCatalogue } from "@/interfaces/types/PatientCatalogueType";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK


const breadcrumb = {

    index: {
        title: 'Quản lý nhóm bệnh nhân',
        route: '/patient/index'
    },
    create: {
        title: 'Thêm mới nhóm bệnh nhân',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    permission: {
        title: 'Phân quyền nhóm bệnh nhân',
        route: '/patient/catalogue/permission'
    },

}

const model = 'patient_catalogues'

interface tableColumn {
    name: string,
    render: (item: PatientCatalogue) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Tên nhóm bệnh nhân',
        render: (item: PatientCatalogue) => <span><Link to={`/patient/index?patient_catalogue_id=${item.id}`}>{item.name}</Link></span>
    },

    {
        name: 'Số lượng',
        render: (item: PatientCatalogue) => <span className="">{item.patients_count}</span>
    },
    {
        name: 'Mô tả',
        render: (item: PatientCatalogue) => <span>{item.description}</span>
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


export {
    breadcrumb,
    model,
    tableColumn,
    buttonActions,
}