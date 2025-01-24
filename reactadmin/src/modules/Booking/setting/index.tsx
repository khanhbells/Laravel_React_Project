//REACT
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { Booking } from "@/interfaces/types/BookingType";
//INTERFACE & TYPE
import { ActionParam, ButtonAction, OpenSheetFunction, Select } from "@/interfaces/BaseServiceInterface";
//HOOK
import dayjs from "dayjs";


const breadcrumb = {

    index: {
        title: 'Quản lý đơn đặt lịch khám',
        route: '/booking/index'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'bookings'

interface tableColumn {
    name: string,
    render: (item: Booking) => JSX.Element
}


const tableColumn: tableColumn[] = [

    {
        name: 'Bác sĩ',
        render: (item: Booking) => (
            <div className="flex items-center">
                <div className="block mr-[10px]">
                    <img className=" object-cover h-[60px] w-[100px] rounded cursor-pointer" src={item.image} alt="" />
                </div>
                <div>
                    <div className="name">
                        <span>{item.name_doctor}</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        name: 'Ngày khám',
        render: (item: Booking) => <span>{item.date}</span>
    },
    {
        name: 'Thời gian khám',
        render: (item: Booking) => <span className="cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded bg-cyan-600 px-[5px] py-[0px] ">{`${dayjs(item.start_time).format('hh:mm A')} - ${dayjs(item.end_time).format('hh:mm A')}`}</span>
    },
    {
        name: 'Tên bệnh nhân',
        render: (item: Booking) => <span>{item.full_name}</span>
    },
    {
        name: 'Thời gian đặt lịch',
        render: (item: Booking) => <span>{item.booking_date}</span>
    },
    {
        name: 'Trạng thái xác nhận',
        render: (item: Booking) => <span className="">{
            item.status === 'pending' ? 'Đang chờ xác nhận' : item.status === 'confirm' ? 'Đã xác nhận' : ''
        }</span>
    },
    {
        name: 'Hình thức thanh toán',
        render: (item: Booking) => <span className="">{
            item.method === 'cod' ? 'Thanh toán trực tiếp' : item.method === 'memo' ?
                'Thanh toán bằng ví momo' : item.method === 'paypal' ?
                    'Thanh toán bằng paypal' : item.method === 'vnpay' ?
                        'Thanh toán bằng VNPAY' : ''
        }</span>
    },
    {
        name: 'Trạng thái thanh toán',
        render: (item: Booking) => <span className="">{
            item.payment_status === 'pending' ? 'Chưa thanh toán' : item.payment_status === 'confirm' ? 'Đã thanh toán' : ''
        }</span>
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
]




const extraFilterItems: Select[] = [
    {
        id: 'user_catalogue_Id',
        placeholder: 'Chọn đơn đặt lịch khám',
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

