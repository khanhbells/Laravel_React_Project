//img
import cod from "@/assets/COD.svg";
import momo from "@/assets/momo-icon.webp";
import paypal from "@/assets/paypal.ico";
import vnpay from "@/assets/Icon-VNPAY-QR.webp";
import zalopay from "@/assets/zalopay.png";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Controller } from "react-hook-form";

interface ICustomRadioGroup {
    name: string,
    control: any,
    defaultValue: string,
    errors: any
}

const CustomRadioGroup = ({
    name,
    control,
    defaultValue,
    errors
}: ICustomRadioGroup) => {
    return (
        <>
            <div>
                <div className="mb-[10px] text-sky-600 font-semibold">Hình thức thanh toán:</div>
                <Controller
                    name={name}
                    defaultValue={defaultValue}
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={(selectedValue) => {
                                field.onChange(selectedValue);
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cod" id="r1" />
                                <Label htmlFor="r1" className="flex">
                                    <div
                                        style={{
                                            backgroundImage: `url(${cod})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            width: "30px", // Đặt chiều rộng
                                            height: "30px" // Đặt chiều cao
                                        }}
                                    >
                                    </div>
                                    <div className="ml-[10px] mt-[5px]">Thanh toán sau tại cơ sở y tế</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="momo" id="r2" />
                                <Label htmlFor="r2" className="flex">
                                    <div
                                        style={{
                                            backgroundImage: `url(${momo})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            width: "30px", // Đặt chiều rộng
                                            height: "30px" // Đặt chiều cao
                                        }}
                                    >
                                    </div>
                                    <div className="ml-[10px] mt-[5px]">Thanh toán bằng ví điện thử Momo</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paypal" id="r3" />
                                <Label htmlFor="r3" className="flex">
                                    <div
                                        style={{
                                            backgroundImage: `url(${paypal})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            width: "30px", // Đặt chiều rộng
                                            height: "30px" // Đặt chiều cao
                                        }}
                                    >
                                    </div>
                                    <div className="ml-[10px] mt-[5px]">Thanh toán bằng Paypal</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="vnpay" id="r4" />
                                <Label htmlFor="r4" className="flex">
                                    <div
                                        className="pt-[6px]"
                                        style={{
                                            backgroundImage: `url(${vnpay})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            width: "30px", // Đặt chiều rộng
                                            height: "30px", // Đặt chiều cao
                                        }}
                                    >
                                    </div>
                                    <div className="ml-[10px] mt-[5px]">Thanh toán bằng VNPAY</div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="zalopay" id="r5" />
                                <Label htmlFor="r5" className="flex">
                                    <div
                                        className="pt-[6px]"
                                        style={{
                                            backgroundImage: `url(${zalopay})`,
                                            backgroundSize: "contain",
                                            backgroundRepeat: "no-repeat",
                                            width: "30px", // Đặt chiều rộng
                                            height: "30px", // Đặt chiều cao
                                        }}
                                    >
                                    </div>
                                    <div className="ml-[10px] mt-[5px]">Thanh toán bằng ZaloPay</div>
                                </Label>
                            </div>
                        </RadioGroup>
                    )}
                />
            </div>
            <div className="error-line text-right mt-[-10px]" >
                {errors[name] && <span className="text-red-500 text-xs">{errors[name].message}</span>}
            </div>
        </>
    )
}
export default CustomRadioGroup