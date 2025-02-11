import { addCommas } from "@/helper/myHelper"
import { memo } from "react"

interface IBookingInforPaymentMomo {
    dataMomo: { 'm2signature': string | undefined, 'partnerSignature': string | undefined, 'message': string | undefined };
}
const BookingInforPaymentMomo = ({
    dataMomo
}: IBookingInforPaymentMomo) => {
    return (
        <>
            <div className="my-[10px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold font-montserrat">Thông tin thanh toán qua ví điện tử Momo</div>
                </div>
                <div className="mt-[10px]">
                    {
                        dataMomo['m2signature'] === dataMomo['partnerSignature'] ?
                            (
                                <div className="flex justify-between mb-[5px]">
                                    <span>Tình trạng thanh toán:</span>
                                    <span className="font-semibold text-[green]">Thành công</span>
                                </div>
                            ) :
                            (
                                <div className="flex justify-between mb-[5px]">
                                    <span>Giao dịch thanh toán không thành công. Vui lòng liên hệ:</span>
                                    <span className="font-semibold">0834225628</span>
                                </div>
                            )
                    }
                </div>
            </div>
        </>
    )
}

export default memo(BookingInforPaymentMomo)