import BookingInforPatient from "@/components/BookingInforPatient"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { IBooking, getBookingById } from "@/service/BookingService"
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule"

const Success = () => {

    const { id } = useParams()

    const { data, isLoading, isError } = useQuery<IBooking>(['bookings', id],
        () => getBookingById(id),
        {
            enabled: !!id,
        }
    )

    return (
        <>
            <div className="bg-sky-100 h-[100%]">
                <div className="uppercase font-semibold text-center px-[20px] pt-[20px] pb-[5px] text-[20px]">Đặt lịch khám bệnh thành công</div>
                <div className="text-center italic px-[450px] text-[15px]">Chúng tôi đã gửi đơn đặt lịch khám đến email của bạn để có thể kiểm tra lại. Vui lòng để ý email, bác sĩ sẽ phản hồi trong thời gian sớm nhất! Xin chân thành cảm ơn!</div>
                <div className="px-[500px]">
                    <BookingInforPatient
                        data={data}
                    />
                    <BookingDoctorSchedule
                        data={data}
                    />
                </div>
            </div>
        </>
    )
}

export default Success