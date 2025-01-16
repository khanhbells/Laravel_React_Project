//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomCKEditor from "@/components/CustomCKEditor";
import CustomInput from "./CustomInput";
import { useEffect, useRef, memo } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
//CONTEXT
import { useTimeSlotContext } from "@/contexts/TimeSlotContext";
import { useFormContext } from "react-hook-form";
//INTERFACE
import { SchedulePayloadInput } from "@/interfaces/types/ScheduleType";

interface DetailTimeSlotProps {
    label?: string
}
const DetailTimeSlot = ({
    label,
}: DetailTimeSlotProps) => {
    const { activeIndices } = useTimeSlotContext();
    const { register, formState: { errors } } = useFormContext<SchedulePayloadInput>();

    return (
        <Card className="rounded-[5px] mb-[20px]">
            <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                <CardTitle className="uppercase">Thông tin chi tiết</CardTitle>
            </CardHeader>
            <CardContent className="pt-[15px]">
                {activeIndices.length > 0 &&
                    activeIndices.map((value, index) => (
                        <div key={value.id} className="flex flex-wrap items-center gap-4 mb-[20px]">
                            <input
                                type="hidden"
                                value={value.id}
                                {...register(`time_slots.${index}.time_slot_id`)} // Gom ID vào timeSlots
                            />
                            <div className="flex items-center gap-2 w-[48%]">
                                <Label className="w-[20%]">Thời gian</Label>
                                <Input
                                    type="text"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    readOnly
                                    value={`${value.start_time}-${value.end_time}`}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-[48%]">
                                <Label className="w-[20%]">Giá tiền</Label>
                                <Input
                                    type="number"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    {...register(`time_slots.${index}.price`)}
                                />
                                {errors.time_slots?.[index]?.price && (
                                    <span className="text-red-500 text-xs">
                                        {errors.time_slots[index].price.message}
                                    </span>
                                )}
                            </div>

                        </div>
                    ))}
            </CardContent>
        </Card>
    );
};

export default memo(DetailTimeSlot)