import { addCommas } from "@/helper/myHelper"
import { memo } from "react"

interface IBookingInforPaymentVNPay {
    secureHash: string,
    vnp_SecureHash: string,
    queryParams: Record<string, string>
}
const BookingInforPaymentVNPay = ({
    secureHash,
    vnp_SecureHash,
    queryParams,
}: IBookingInforPaymentVNPay) => {
    return (
        <>
            <div className="my-[10px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold font-montserrat">Thông tin thanh toán qua ví điện tử VNPAY</div>
                </div>
                <div className="mt-[10px]">
                    <div className="flex justify-between mb-[5px]">
                        <span>Mã đơn hàng:</span>
                        <span className="font-semibold">{queryParams.vnp_TxnRef}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Số tiền:</span>
                        <span className="font-semibold">{`${addCommas(Number(queryParams.vnp_Amount) / 100)}đ`}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Nội dung thanh toán:</span>
                        <span className="font-semibold">{queryParams.vnp_OrderInfo}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Mã phản hồi:</span>
                        <span className="font-semibold">{queryParams.vnp_ResponseCode}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Mã GD Tại VNPAY:</span>
                        <span className="font-semibold">{queryParams.vnp_TransactionNo}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Mã Ngân hàng:</span>
                        <span className="font-semibold">{queryParams.vnp_BankCode}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Thời gian thanh toán:</span>
                        <span className="font-semibold">{queryParams.vnp_PayDate}</span>
                    </div>
                    <div className="flex justify-between mb-[5px]">
                        <span>Kết quả:</span>
                        {
                            (secureHash && vnp_SecureHash && secureHash === vnp_SecureHash) ?
                                (
                                    queryParams.vnp_ResponseCode === '00' ?
                                        (
                                            <span className="font-semibold text-[green]">
                                                Giao dịch qua cổng VNPAY thành công
                                            </span>
                                        )
                                        :
                                        (
                                            <span className="font-semibold text-[red]">
                                                Giao dịch qua cổng VNPAY không thành công
                                            </span>
                                        )
                                )
                                :

                                (
                                    <span className="font-semibold text-[red]">
                                        Chữ ký không hợp lệ
                                    </span>
                                )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(BookingInforPaymentVNPay)