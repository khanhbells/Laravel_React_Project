import dayjs from "dayjs"
import { addCommas } from "@/helper/myHelper"
import { memo } from "react"
interface IBookingDoctorSchedule {
    data: any
}

const BookingDoctorSchedule = ({
    data
}: IBookingDoctorSchedule) => {
    return (
        <>
            <div className="my-[20px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold">Thông tin bác sĩ và lịch khám</div>
                    <div className="mt-[10px]">
                        <div className="flex justify-between mb-[5px]">
                            <span>Bác sĩ:</span>
                            <span className="font-semibold">{data?.name_doctor}</span>
                        </div>
                        <div className="flex justify-between mb-[5px]">
                            <span>Mã đơn khám:</span>
                            <span className="font-semibold">{data?.code}</span>
                        </div>
                        <div className="flex justify-between mb-[5px]">
                            <span>Ngày khám:</span>
                            <span className="font-semibold">{dayjs(data?.date).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between mb-[5px]">
                            <span>Thời gian khám:</span>
                            <span className="font-semibold">{`${data?.start_time} - ${data?.end_time}`}</span>
                        </div>
                        <div className="flex justify-between mb-[5px]">
                            <span>Giá khám:</span>
                            <span className="font-semibold text-[#f00]">{`${addCommas(data?.total_price)} đ`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(BookingDoctorSchedule)