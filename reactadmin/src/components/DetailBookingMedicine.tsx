//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { memo } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
//CONTEXT
import { useMedicineContext } from "@/contexts/MedicineContext";
import { useFormContext } from "react-hook-form";
//INTERFACE
import { addCommas } from "@/helper/myHelper";
import { BookingMedicinePayloadInput } from "@/interfaces/types/BookingMedicineType";
import { Textarea } from "./ui/textarea";

interface DetailBookingMedicineProps {
    label?: string
}
const DetailBookingMedicine = ({
    label,
}: DetailBookingMedicineProps) => {
    const { activeIndices } = useMedicineContext();
    const { register, formState: { errors } } = useFormContext<BookingMedicinePayloadInput>();

    return (
        <Card className="rounded-[5px] mb-[20px]">
            <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                <CardTitle className="uppercase">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="pt-[15px]">

                {activeIndices.length > 0 &&
                    activeIndices.map((value, index) => (
                        <div key={value.id} className="flex-wrap items-center grid grid-cols-12 gap-4 mb-[20px]">
                            <input
                                type="hidden"
                                value={value.id}
                                {...register(`medicines.${index}.medicine_id`)} // Gom ID vào timeSlots
                            />
                            <div className="flex items-center gap-2 col-span-3">
                                <Label className="w-[20%]">Tên:</Label>
                                <Input
                                    type="text"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    readOnly
                                    value={`${value.name}`}
                                />
                            </div>
                            <div className="flex items-center gap-2 col-span-3">
                                <Label className="w-[50%]">Liều lượng</Label>
                                <Input
                                    type="text"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    {...register(`medicines.${index}.dosage`, {
                                        onChange: (event) => {
                                            const formattedValue = event.target.value;
                                            event.target.value = formattedValue;
                                        }
                                    })}
                                />
                                {errors.medicines?.[index]?.dosage && (
                                    <span className="text-red-500 text-xs">
                                        {errors.medicines[index].dosage.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 col-span-3">
                                <Label className="w-[50%]">Số lượng</Label>
                                <Input
                                    type="text"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    {...register(`medicines.${index}.qty`, {
                                        onChange: (event) => {
                                            const formattedValue = addCommas(event.target.value);
                                            event.target.value = formattedValue;
                                        }
                                    })}
                                />
                                {errors.medicines?.[index]?.qty && (
                                    <span className="text-red-500 text-xs">
                                        {errors.medicines[index].qty.message}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 col-span-3">
                                <Label className="w-[50%]">Hướng dẫn</Label>
                                <Textarea
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    {...register(`medicines.${index}.usage`, {
                                        onChange: (event) => {
                                            const formattedValue = event.target.value;
                                            event.target.value = formattedValue;
                                        }
                                    })}
                                />
                                {errors.medicines?.[index]?.usage && (
                                    <span className="text-red-500 text-xs">
                                        {errors.medicines[index].usage.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                {errors.medicines && (
                    <span className="text-red-500 text-xs">
                        {errors.medicines.message}
                    </span>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(DetailBookingMedicine)