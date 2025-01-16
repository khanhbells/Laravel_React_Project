//REACT
import { memo, useState } from "react";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import Datepicker from "react-tailwindcss-datepicker";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
//INTERFACE
import { Option } from "@/components/CustomSelectBox";


interface IDatePickerProps {
}

const CustomDatePicker = ({
}: IDatePickerProps) => {
    const [value, setValue] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null
    });

    // Lấy ngày hiện tại
    const today = new Date();
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Ngày khám bệnh
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <Datepicker
                        useRange={false}
                        asSingle={true}
                        value={value}
                        onChange={newValue => setValue({
                            startDate: newValue?.startDate || null,
                            endDate: newValue?.endDate || null
                        })}
                        minDate={today}
                    />
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CustomDatePicker)