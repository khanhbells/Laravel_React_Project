//REACT
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
//SETTINGS
import { Booking } from "@/interfaces/types/BookingType";
//INTERFACE & TYPE
import { ActionParam, ButtonAction, OpenSheetFunction, Select } from "@/interfaces/BaseServiceInterface";
//HOOK
import dayjs from "dayjs";

export const redirectIfSuccess = '/booking/index'

const breadcrumb = {

    index: {
        title: 'Quản lý đơn đặt lịch khám',
        route: '/booking/index'
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Dưới đây là thông tin đơn đặt lịch khám của bệnh nhân. Các bác sĩ chú ý xem kỹ rồi xác nhận và sắp xếp thời gian thăm khám bệnh nhân đúng hẹn!',
    },
    create: {
        title: 'Thêm mới đơn thuốc khám',
        description: 'Dưới đây là thông tin các thuốc khám. Các bác sĩ chú ý xem kỹ tình trạng của bệnh nhân rồi lựa chọn thuốc hợp lý!',
        route: 'booking/medicine/:id'
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
        render: (item: Booking) => <span>{dayjs(item.date).format('DD/MM/YYYY')}</span>
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
        render: (item: Booking) => <span>{dayjs(item.booking_date).format('DD/MM/YYYY - HH:mm:ss')}</span>
    },
    {
        name: 'Trạng thái xác nhận',
        render: (item: Booking) => <span className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[12px] ${item.status === 'pending' ? 'bg-[orange]' : item.status === 'confirm' ? 'bg-[green]' : item.status === 'stop' ? 'bg-[red]' : ''
            }`}>{
                item.status === 'pending' ? 'Đang chờ xác nhận' : item.status === 'confirm' ? 'Đã xác nhận' : item.status === 'stop' ? 'Đã hủy' : ''
            }</span>
    },
    {
        name: 'Hình thức thanh toán',
        render: (item: Booking) => <span className="">{
            item.method === 'cod' ? 'Thanh toán trực tiếp' : item.method === 'momo' ?
                'Thanh toán bằng ví momo' : item.method === 'paypal' ?
                    'Thanh toán bằng paypal' : item.method === 'vnpay' ?
                        'Thanh toán bằng VNPAY' : 'Thanh toán bằng Zalopay'
        }</span>
    },
    {
        name: 'Trạng thái thanh toán',
        render: (item: Booking) => <span className={`cursor-pointer cat-item-name mr-[10px] text-[#fff] inline-block rounded px-[5px] py-[0px] text-[12px] ${item.payment_status === 'pending' ? 'bg-[orange]' : item.payment_status === 'confirm' ? 'bg-[green]' : item.payment_status === 'stop' ? 'bg-[red]' : ''
            }`}>{
                item.payment_status === 'pending' ? 'Chưa thanh toán' : item.payment_status === 'confirm' ? 'Đã thanh toán' : item.payment_status === 'stop' ? 'Đã hủy' : ''
            }</span>
    },
]

const optionStatus = [
    { value: 'pending', label: 'Đang chờ xác nhận' },
    { value: 'confirm', label: 'Đã xác nhận' },
    { value: 'stop', label: 'Đã hủy' },
]

const optionPaymentStatus = [
    { value: 'pending', label: 'Chưa thanh toán' },
    { value: 'confirm', label: 'Đã thanh toán' },
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








export {
    breadcrumb,
    buttonActions,
    model,
    tableColumn,
    optionStatus,
    optionPaymentStatus,
};

