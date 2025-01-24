import { addCommas } from "@/helper/myHelper";
import { Controller } from "react-hook-form";
import Control from "react-select/dist/declarations/src/components/Control";
import CustomInput from "./CustomInput";

interface ITotalPriceBooking {
    selectedDataSchedule: any,
    control: any,
    namePriceSchedule: string,
    nameTotalPrice: string
}

const TotalPriceBooking = ({
    selectedDataSchedule,
    control,
    namePriceSchedule,
    nameTotalPrice
}: ITotalPriceBooking) => {

    const totalPrice = selectedDataSchedule.price

    return (
        <>
            <div className="">
                <div className="h-[100%] bg-sky-100 p-[10px] rounded-lg border border-sky-300">
                    <div className="border-b border-primary pb-[5px] mb-[5px]">
                        <div className="flex justify-between">
                            <div>Giá khám:</div>
                            <div className="float-right">{`${addCommas(selectedDataSchedule.price)}đ`}</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Phí dịch vụ:</div>
                            <div className="float-right">Miễn phí</div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[#f00]">
                            <div>Tổng cộng:</div>
                            <div>{`${addCommas(selectedDataSchedule.price)}đ`}</div>
                        </div>
                    </div>
                </div>
                <CustomInput
                    name={namePriceSchedule}
                    type="hidden"
                    value={selectedDataSchedule.price}
                />
                <CustomInput
                    name={nameTotalPrice}
                    type="hidden"
                    value={totalPrice}
                />
                <div>
                    <div className="text-center italic">
                        Quý khách vui lòng điền đầy đủ thông tin để tiết kiệm thời gian làm thủ tục khám
                    </div>
                </div>
            </div>
        </>
    )

}

export default TotalPriceBooking