//REACT
import React from "react";
import { Link } from "react-router-dom";
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { TimeSlot } from "@/interfaces/types/TimeSlotType";
//INTERFACE & TYPE
import { ButtonAction, ActionParam, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//HOOK


const breadcrumb = {

    index: {
        title: 'Quản lý thời gian khám',
        route: '/setting/timeSlot/index'
    },
    create: {
        title: 'Thêm mới thời gian khám',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'time_slots'

interface tableColumn {
    name: string,
    render: (item: TimeSlot) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Thời gian bắt đầu',
        render: (item: TimeSlot) => <span className="">{item.start_time}</span>
    },
    {
        name: 'Thời gian kết thúc',
        render: (item: TimeSlot) => <span className="">{item.end_time}</span>
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