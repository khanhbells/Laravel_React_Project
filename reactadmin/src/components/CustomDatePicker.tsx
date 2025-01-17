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

interface IDatePickerProps {
    name: string,
    label: string
}

const CustomDatePicker = ({
    name,
    label
}: IDatePickerProps) => {

    //Cấu hình ngày được chọn
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);


    const { register, formState: { errors }, control } = useFormContext()
    const errorMessage = errors[name]?.message

    // Lấy ngày hiện tại

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        {label}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => {
                            const handleChange = (selected: any) => {
                                const formattedDate = selected?.startDate
                                    ? new Date(selected.startDate).toISOString().split("T")[0] // Format thành YYYY-MM-DD
                                    : null;
                                field.onChange(formattedDate); // Lưu giá trị chuỗi vào form
                            };
                            return (
                                <Datepicker
                                    useRange={false}
                                    asSingle={true}
                                    value={field.value ? { startDate: field.value, endDate: field.value } : null}
                                    onChange={handleChange}
                                    minDate={tomorrow}
                                />
                            );
                        }}
                    />
                    <div className="error-line text-right ">
                        {typeof errorMessage === 'string' && (
                            <span className="text-red-500 text-xs">{errorMessage}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(CustomDatePicker)