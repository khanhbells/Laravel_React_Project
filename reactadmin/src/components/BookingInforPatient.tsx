import { memo } from "react"
import dayjs from "dayjs"

interface IBookingInfoPatient {
    data: any
}
const BookingInfoPatient = ({
    data
}: IBookingInfoPatient) => {
    return (
        <>
            <div className="my-[10px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold">Thông tin bệnh nhân khám bệnh</div>
                </div>
                <div className="mt-[10px]">
                    <div className="flex justify-between mb-[5px]">
                        <span>Họ tên:</span>
                        <span className="font-semibold">{data?.full_name}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Email:</span>
                        <span className="font-semibold">{data?.email}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>SĐT:</span>
                        <span className="font-semibold">{data?.phone}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Ngày sinh:</span>
                        <span className="font-semibold">{dayjs(data?.birthday).format('DD/MM/YYYY')}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Giới tính:</span>
                        <span className="font-semibold">{data?.gender && data.gender === '1' ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Thành phố:</span>
                        <span className="font-semibold">{data?.name_province}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Quận huyện:</span>
                        <span className="font-semibold">{data?.name_district}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Phường xã:</span>
                        <span className="font-semibold">{data?.name_ward}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Địa chỉ hiện tại:</span>
                        <span className="font-semibold">{data?.address}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Lý do khám bệnh:</span>
                        <span className="font-semibold">{data?.note}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Hình thức thanh toán:</span>
                        <span className="font-semibold">{
                            data?.method === 'cod' ?
                                'Thanh toán trực tiếp' : data?.method === 'momo' ?
                                    'Thanh toán qua momo' : data?.method === 'paypal' ?
                                        'Thanh toán qua paypal' : data?.method === 'vnpay' ? 'Thanh toán qua VNPAY' : ''
                        }</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(BookingInfoPatient)