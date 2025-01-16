//REACT
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
//COMPONENT
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ITimePickerProps {
    name: string,
    label: string
}

const CustomTimePicker = ({
    name,
    label
}: ITimePickerProps) => {
    const { register, formState: { errors }, control } = useFormContext()
    const errorMessage = errors[name]?.message


    return (
        <>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => {
                        const handleChange = (value: any) => {
                            if (dayjs(value).isValid()) {
                                const formattedValue = dayjs(value).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)');
                                field.onChange(formattedValue);
                            } else {
                                field.onChange(null); // Xử lý trường hợp giá trị không hợp lệ
                            }
                        };
                        return (
                            <TimePicker
                                label={label}
                                value={field.value ? dayjs(field.value) : null}
                                onChange={handleChange}
                                viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                    seconds: renderTimeViewClock,
                                }}
                            />
                        );
                    }}
                />
            </LocalizationProvider>
            <div className="error-line text-right ">
                {typeof errorMessage === 'string' && (
                    <span className="text-red-500 text-xs">{errorMessage}</span>
                )}
            </div>
        </>
    );
}

export default CustomTimePicker