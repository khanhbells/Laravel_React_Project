import { LoadingSpinner } from "./ui/loading"
import { RiHospitalLine } from "react-icons/ri"
import { LuCalendarCheck } from "react-icons/lu"
import dayjs from "dayjs"
import { Link } from "react-router-dom"

interface IInforScheduleBooking {
    [key: string]: any

}


const InforScheduleBooking = ({
    dataDoctor,
    selectedDataSchedule,
    schedule
}: IInforScheduleBooking) => {
    return (
        <>
            <div className="border-b-2 border-sky-200 h-[100%] pb-[10px]">
                <div className={`flex py-[10px] bg-[white] `}>
                    {dataDoctor ? (
                        <div
                            className="w-[120px] h-[120px] rounded-full bg-cover bg-no-repeat bg-center"
                            style={{ backgroundImage: `url(${dataDoctor.image})` }}
                        ></div>
                    ) : (
                        <LoadingSpinner />
                    )}
                    <div className='w-[80%] flex flex-col ml-[20px]'>
                        {/* up */}
                        <div className='text-[20px] font-semibold  '>
                            {
                                `${dataDoctor ? dataDoctor.exp : ''} ${dataDoctor ? dataDoctor.name : 'Loading...'}`
                            }
                        </div>
                        {/* down */}
                        <div className='pt-[10px]'>
                            <div className="flex">
                                <LuCalendarCheck className="mt-[3px] mr-[10px] text-[18px]" />
                                <div className="font-semibold text-[#FEC206] text-[15px] pb-[10px]">
                                    {`${dayjs(selectedDataSchedule.start_time).format('hh:mm A')} - ${dayjs(selectedDataSchedule.end_time).format('hh:mm A')} - ${schedule}`}
                                </div>
                            </div>
                            <div className="flex">
                                <RiHospitalLine className="mr-[10px] text-[30px]" />
                                <div className="mt-[4px]">
                                    <div className="font-semibold">{dataDoctor.clinic_name}</div>
                                    <div>{dataDoctor.clinic_address}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={``} className="">
                    <div className="text-center mt-[10px] text-white bg-sky-300 p-[5px] rounded">+ Đăng ký thành viên</div>
                </Link>
            </div>
        </>
    )
}

export default InforScheduleBooking