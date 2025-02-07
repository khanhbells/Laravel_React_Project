import dayjs from "dayjs"
import { addCommas } from "@/helper/myHelper"
import { memo } from "react"
interface IBookingMedicine {
    data: any
}
interface IMedicine {
    id: string,
    name: string,
    dosage: string,
    qty: number,
    usage: string
}

const BookingMedicine = ({
    data
}: IBookingMedicine) => {
    return (
        <>
            <div className="my-[20px] p-[10px] border-4 border-sky-200 rounded-lg border-dotted bg-sky-50">
                <div>
                    <div className="uppercase text-center font-semibold">Thông tin đơn thuốc đã kê cho bệnh nhân</div>
                    <div className="mt-[10px]">
                        <table className="w-[100%] border-collapse">
                            <tr>
                                <th>Tên thuốc</th>
                                <th>Liều lượng</th>
                                <th>Số lượng</th>
                                <th>Hướng dẫn</th>
                            </tr>
                            {
                                data && data.medicines && data.medicines.length > 0 && data.medicines.map((medicine: IMedicine, index: number) =>
                                (
                                    <tr className="text-center" key={index}>
                                        <td>{medicine.name}</td>
                                        <td>{medicine.dosage}</td>
                                        <td>{medicine.qty}</td>
                                        <td>{medicine.usage}</td>
                                    </tr>
                                )
                                )
                            }
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(BookingMedicine)