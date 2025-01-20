import Select from 'react-select'
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
const DoctorSchedule = () => {

    const options = [
        { label: 'Thứ 2 - 20/1', value: '2' },
        { label: 'Thứ 3 - 21/1', value: '3' },
    ]
    return (
        <>
            <div className="doctor-schedule-container border-primary border-r h-[100%]">
                <div className="all-schedule">
                    <Select
                        options={options}
                        className='w-[150px] '
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
                        <Button
                            type="button"
                            variant="outline"
                            className={`px-1 py-2 m-2 bg-[#fff04b] font-normal`}
                        >
                            08:00 AM - 09:00 AM
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className={`px-1 py-2 m-2 bg-[#fff04b] font-normal`}
                        >
                            08:00 AM - 09:00 AM
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className={`px-1 py-2 m-2 bg-[#fff04b] font-normal`}
                        >
                            08:00 AM - 09:00 AM
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className={`px-1 py-2 m-2 bg-[#fff04b] font-normal`}
                        >
                            08:00 AM - 09:00 AM
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DoctorSchedule