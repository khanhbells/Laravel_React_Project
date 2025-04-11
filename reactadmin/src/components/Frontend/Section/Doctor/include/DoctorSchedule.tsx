import Select from 'react-select'
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import { LoadingSpinner } from '@/components/ui/loading';
import { FaRegHandPointer } from "react-icons/fa6";
import { memo } from 'react';
//CONTEXT
import { useDataSchedule } from '@/contexts/DataScheduleContext';
interface ISchedules {
    options: { value: string, label: string }[]
    data: any,
    className?: string
}

interface TimeSlot {
    [key: string]: any
}

const DoctorSchedule = ({
    options,
    data,
    className
}: ISchedules) => {
    const { selectedDataSchedule, setSelectedDataSchedule } = useDataSchedule()
    const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([])
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

    const handleSelectChange = (selected: string | undefined) => {
        setSelectedDate(selected)
        if (data) {
            const timeSlotData = data.filter((value: TimeSlot) => value.date === selected)
            setTimeSlot(timeSlotData)
            setSelectedTimeSlot(null)
        }
    }

    const handleSetDataSchedule = (value: TimeSlot) => {
        if (selectedTimeSlot === value) {
            setSelectedTimeSlot(null)
            setSelectedDataSchedule(null)
        } else {
            setSelectedDataSchedule(value)
            setSelectedTimeSlot(value)
        }
    }



    useEffect(() => {
        if (options && options.length > 0) {
            const defaultDate = options[0]?.value; // Lấy giá trị của ngày đầu tiên
            handleSelectChange(defaultDate);
        } else {
            setTimeSlot([])
        }
    }, [options, data]);

    return (
        <>
            <div className={`doctor-schedule-container ${className ?? ''} h-[100%] `}>
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
                            timeSlot && timeSlot.length > 0 ? timeSlot.map((value: TimeSlot, index: number) =>
                            (
                                <Button
                                    key={index}
                                    type="button"
                                    variant="outline"
                                    className={`px-1 py-2 m-2 bg-teal-400 text-[16px] font-normal text-white ${selectedTimeSlot === value ? 'bg-sky-400 text-white' : 'bg-teal-400'
                                        }`}
                                    onClick={() => handleSetDataSchedule(value)}
                                >
                                    {`${value.start_time} - ${value.end_time}`}
                                </Button>
                            )
                            ) : options.length === 0 ? (
                                <div className='italic mt-[5px]'>
                                    Bác sĩ hiện tại chưa có lịch khám bệnh!. Vui lòng quay lại vào dịp khác
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner className="mr-[5px]" />
                                    Loading...
                                </div>
                            )
                        }
                        <div className="book-free mt-[5px]">
                            <span className='flex'>Chọn <FaRegHandPointer className='mx-[5px]' /> và đặt (miễn phí)</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(DoctorSchedule)