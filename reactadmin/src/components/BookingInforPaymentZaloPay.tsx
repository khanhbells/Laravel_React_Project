import { addCommas } from "@/helper/myHelper"
import { memo } from "react"

interface IBookingInforPaymentZaloPay {
}
const BookingInforPaymentZaloPay = ({
}: IBookingInforPaymentZaloPay) => {
    return (
        <>
            <div className="my-[10px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold font-montserrat">Thông tin thanh toán qua ví điện tử ZaloPay</div>
                </div>
                <div className="mt-[10px]">
                    <div className="flex justify-between mb-[5px]">
                        <span>Tình trạng thanh toán:</span>
                        <span className="font-semibold text-[green]">Thành công</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(BookingInforPaymentZaloPay)