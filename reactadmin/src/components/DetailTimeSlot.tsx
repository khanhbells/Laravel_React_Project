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
import { addCommas } from "@/helper/myHelper";

interface DetailTimeSlotProps {
    label?: string
}
const DetailTimeSlot = ({
    label,
}: DetailTimeSlotProps) => {
    const { activeIndices } = useTimeSlotContext();
    const { register, formState: { errors }, setValue, getValues } = useFormContext<SchedulePayloadInput>();

    // Đồng bộ activeIndices với time_slots trong form
    useEffect(() => {
        const currentTimeSlots = getValues('time_slots') || []; // Lấy dữ liệu time_slots hiện tại từ form
        const updatedTimeSlots = activeIndices.map((timeSlot) => {
            // Tìm time_slot hiện tại trong form để giữ giá trị price nếu đã nhập
            const existingSlot = currentTimeSlots.find((slot) => slot.time_slot_id === timeSlot.id);
            return {
                time_slot_id: timeSlot.id,
                price: existingSlot?.price || '', // Giữ giá trị price cũ nếu có, nếu không để rỗng
            };
        });
        setValue('time_slots', updatedTimeSlots); // Cập nhật lại time_slots trong form
    }, [activeIndices, setValue, getValues]);

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
                                    type="text"
                                    className="w-full focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-2"
                                    {...register(`time_slots.${index}.price`, {
                                        onChange: (event) => {
                                            const formattedValue = addCommas(event.target.value);
                                            event.target.value = formattedValue;
                                        }
                                    })}
                                />
                                {errors.time_slots?.[index]?.price && (
                                    <span className="text-red-500 text-xs">
                                        {errors.time_slots[index].price.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                {errors.time_slots && (
                    <span className="text-red-500 text-xs">
                        {errors.time_slots.message}
                    </span>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(DetailTimeSlot)