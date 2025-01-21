import Select from 'react-select'
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { LoadingSpinner } from '@/components/ui/loading';
interface ISchedules {
    options: { value: string, label: string }[]
    data: any
}

interface TimeSlot {
    [key: string]: any
}

const DoctorSchedule = ({
    options,
    data
}: ISchedules) => {

    const [timeSlot, setTimeSlot] = useState([])
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)

    const handleSelectChange = (selected: string | undefined) => {
        setSelectedDate(selected)
        const timeSlotData = data.filter((value: TimeSlot) => value.date === selected)
        setTimeSlot(timeSlotData)
    }

    useEffect(() => {
        // Nếu options có dữ liệu, tự động chọn ngày đầu tiên
        if (options && options.length > 0) {
            const defaultDate = options[0]?.value; // Lấy giá trị của ngày đầu tiên
            handleSelectChange(defaultDate);
        }
    }, [options, data]);

    return (
        <>
            <div className="doctor-schedule-container border-primary border-r h-[100%]">
                <div className="all-schedule">
                    <Select
                        options={options}
                        className="w-[200px]"
                        placeholder={'Chọn ngày khám bệnh'}
                        onChange={(selected) => handleSelectChange(selected?.value)}
                        value={options?.find(option => option.value === selectedDate) || null}
                    />
                </div>
                <div className="all-available-time">
                    <div className='text-calendar flex text-[#333]'>
                        <div className='flex mt-[5px]'>
                            <FaCalendarAlt
                                className='mr-[5px] mt-[3px]'
                            />
                            <span className='uppercase'> Lịch khám</span>
                        </div>
                    </div>
                    <div className='time-content'>
                        {
                            timeSlot && timeSlot.length > 0 ? timeSlot.map((value: TimeSlot, index: number) => (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="outline"
                                    className={`px-1 py-2 m-2 bg-[#fff04b] font-normal`}
                                >
                                    {`${dayjs(value.start_time).format('hh:mm A')} - ${dayjs(value.end_time).format('hh:mm A')}`}
                                </Button>
                            )) : (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner className="mr-[5px]" />
                                    Loading...
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorSchedule