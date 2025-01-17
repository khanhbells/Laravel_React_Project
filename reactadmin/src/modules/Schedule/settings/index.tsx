//REACT
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { Schedule } from "@/interfaces/types/ScheduleType";
//INTERFACE & TYPE
import { ActionParam, ButtonAction, OpenSheetFunction } from "@/interfaces/BaseServiceInterface";
//SERVICE
//HEPLERS
import { addCommas } from "@/helper/myHelper";
import dayjs from "dayjs";


const model = 'schedules'
export const redirectIfSucces = '/schedule/index'

const breadcrumb = {

    index: {
        title: 'Quản lý lịch khám bệnh',
        route: '/schedule/index'
    },
    create: {
        title: 'Thêm mới lịch khám bệnh',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/schedule/create'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
        route: '/schedule/update/:id'
    },

}


interface tableColumn {
    name: string,
    render: (item: Schedule) => JSX.Element
}
const tableColumn: tableColumn[] = [
    {
        name: 'Bác sĩ',
        render: (item: Schedule) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img className=" object-cover h-[60px] w-[100px] rounded cursor-pointer" src={item.image} alt="" />
                </div>
                <div>
                    <div className="name">
                        <span>{item.name}</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        name: 'Thời gian khám',
        render: (item: Schedule) => <span className="text-[#f00]">{`${dayjs(item.start_time).format('hh:mm A')} - ${dayjs(item.end_time).format('hh:mm A')}`}</span>
    },
    {
        name: 'Ngày khám bệnh',
        render: (item: Schedule) => <span>{item.date}</span>
    },
    {
        name: 'Giá tiền',
        render: (item: Schedule) => <span className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded bg-cyan-600 px-[5px] py-[0px] text-[10px]">{addCommas(item.price)}đ</span>
    },
    {
        name: 'Trạng thái',
        render: (item: Schedule) => <span className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[10px]  
            ${item.status === 'OPEN' ? 'bg-[green]' : item.status === 'CLOSE' ? 'bg-[red]' : 'bg-[orange]'}`}>{item.status}</span>
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
        }
    },
]

const options = [
    {
        value: 'OPEN', label: 'Đang rảnh'
    },
    {
        value: 'WAIT', label: 'Đang chờ'
    },
    {
        value: 'CLOSE', label: 'Đang bận'
    },
]








export {
    breadcrumb, buttonActions, model,
    tableColumn,
    options
};
