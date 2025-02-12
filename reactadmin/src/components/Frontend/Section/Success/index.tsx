import BookingInforPatient from "@/components/BookingInforPatient"
import { useQuery } from "react-query"
import { useLocation, useParams } from "react-router-dom"
import { IBooking, getBookingById } from "@/service/BookingService"
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule"
import { useEffect } from "react"
import BookingInforPaymentVNPay from "@/components/BookingInforPaymentVNPay"
import BookingInforPaymentMomo from "@/components/BookingInforPaymentMomo"
import BookingInforPaymentPaypal from "@/components/BookingInforPaymentPaypal"
import BookingInforPaymentZaloPay from "@/components/BookingInforPaymentZaloPay"

const Success = () => {

    const { id } = useParams()
    const location = useLocation();

    // Lấy tất cả query params từ URL
    const searchParams = new URLSearchParams(location.search);
    const queryParams = Object.fromEntries(searchParams.entries()); // Chuyển thành object

    const { data, isLoading, isError } = useQuery<IBooking>(['bookings', id],
        () => getBookingById(id, Object.keys(queryParams).length ? queryParams : undefined),
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
                        data={data?.bookings}
                    />
                    {
                        queryParams.vnp_BankCode ?
                            (
                                <BookingInforPaymentVNPay
                                    secureHash={data?.secureHash || ''}
                                    vnp_SecureHash={data?.vnp_SecureHash || ''}
                                    queryParams={queryParams}
                                />
                            ) : queryParams.signature ?
                                (
                                    <BookingInforPaymentMomo
                                        dataMomo={typeof data?.momo === 'object' ? data.momo : { m2signature: undefined, partnerSignature: undefined, message: undefined }}
                                    />
                                ) : queryParams.PayerID ? (
                                    <BookingInforPaymentPaypal />
                                ) : queryParams.status && queryParams.status === '1' && (
                                    <BookingInforPaymentZaloPay />
                                )

                    }
                    <BookingDoctorSchedule
                        data={data?.bookings}
                    />
                </div>
            </div>
        </>
    )
}

export default Success