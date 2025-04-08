//REACT
import { useQuery } from "react-query";
//COMPONENT
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { memo, useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading";
//SETTING
import { queryKey } from "@/constant/query";
//HELPER
import dayjs from "dayjs";
//SERVICE
import { pagination } from "@/service/TimeSlotService";
//TYPE
import { TimeSlot as TTimeSlot } from "@/interfaces/types/TimeSlotType";
//CONTEXT
import { useTimeSlotContext } from "@/contexts/TimeSlotContext";
interface TimeSlotProps {
    label?: string,
    onOpenDialog: () => void
    [key: string]: any
}

const TimeSlot = ({
    label,
    onOpenDialog,
    ...restProps
}: TimeSlotProps) => {
    const model = 'time_slots'
    const { data, isLoading, isError, refetch } = useQuery([queryKey.timeSlots], () => pagination('perpage=20'))
    const [customData, setCustomData] = useState<TTimeSlot[]>([]);
    const { activeIndices, setActiveIndices } = useTimeSlotContext();

    useEffect(() => {
        if (!isLoading) {
            const formatData = data[model].map((value: TTimeSlot) => ({
                ...value,
                publish: String(value.publish)
            }))
            setCustomData(formatData)
        }
    }, [data, isLoading])

    useEffect(() => {
        refetch();
    }, [restProps.loadingTimeSlot]);

    const handleButtonClick = (timeSlot: TTimeSlot) => {
        // Kiểm tra xem thời gian khám có đang bị tắt publish hay không
        if (timeSlot.publish !== '2') {
            setActiveIndices((prev) => prev.filter((item) => item.id !== timeSlot.id));
        } else {
            setActiveIndices((prev) => {
                const exists = prev.some((item) => item.id === timeSlot.id);
                return exists ? prev.filter((item) => item.id !== timeSlot.id) // Loại bỏ nếu đã tồn tại
                    : [...prev, timeSlot]; // Thêm nếu chưa tồn tại
            });
        }
    };

    

    useEffect(() => {
        // Lọc bỏ các phần tử không còn hợp lệ trong activeIndices khi customData thay đổi
        setActiveIndices((prev) => prev.filter((item) => {
            // Kiểm tra xem item có tồn tại trong customData và có publish là '2' không
            return customData.some((data) => data.id === item.id && data.publish === '2');
        }));
    }, [customData, setActiveIndices]);

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        <div className="flex justify-between">
                            <span>Chọn thời gian khám bệnh</span>
                            <span className="text-[blue] text-[12px] cursor-pointer" onClick={() => onOpenDialog()}>+ Thêm mới thời gian</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px]">
                    <div className="flex flex-wrap">
                        {
                            isLoading || customData === undefined ? (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner className="mr-[5px]" />
                                </div>
                            ) : (
                                customData.length > 0 &&
                                customData.map((value, index) => (
                                    value.publish === '2' && (
                                        <Button
                                            key={value.id}
                                            type="button"
                                            variant="outline"
                                            className={`px-1 py-2 m-2 ${activeIndices.some((item) => item.id === value.id) ? "bg-primary text-white" : ""}`}
                                            onClick={() => handleButtonClick(value)}
                                        >
                                            {value.start_time} - {value.end_time}
                                        </Button>
                                    )

                                ))
                            )
                        }
                    </div>
                </CardContent>
            </Card >
        </>
    )
}
export default memo(TimeSlot)