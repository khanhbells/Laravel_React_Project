import '../../../assets/scss/DetailDoctor.scss'
import imageSrc from '@/assets/172143-bsckiile-kim-sang.jpg'
import DoctorSchedule from './DoctorSchedule'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { queryKey } from '@/constant/query'
import { findById } from '@/service/Frontend/FrontEndService'
import { endpoint } from '@/constant/endpoint'
import { useEffect } from 'react'
const DetailDoctor = () => {
    const { specialId, doctorId } = useParams()
    const { data, isLoading, isError } = useQuery([queryKey.doctors, doctorId], () => findById(doctorId, endpoint.doctors), {
        enabled: !!doctorId
    })

    useEffect(() => {
        if (!isLoading) {
            console.log(data);
        }
    }, [isLoading, data])
    return (
        <div className="h-[full]">
            <div className='flex px-[200px] py-[10px] bg-[white] '>
                <div
                    className='w-[120px] h-[120px] rounded-full bg-cover bg-no-repeat bg-center'
                    style={{ backgroundImage: `url(${data && data.image})` }}
                >
                </div>
                <div className='w-[80%] flex flex-col pl-[10px]'>
                    {/* up */}
                    <div className='text-[20px] font-semibold pt-[15px]'>
                        {`${data?.exp} ${data?.name}`}
                    </div>
                    {/* down */}
                    <div className='pt-[10px]'>
                        <span
                            className=''
                            dangerouslySetInnerHTML={{ __html: data?.description }}
                        ></span>
                    </div>
                </div>
            </div>
            <div className='schedule-doctor mx-[100px] h-[200px] flex my-[10px] pl-[65px]'>
                <div className='content-left w-[50%]'>
                    <DoctorSchedule />
                </div>
                <div className='content-right w-[50%]'>

                </div>
            </div>
            <div className='detail-info-doctor px-[200px] bg-[#f9f9f9] py-[10px] border-primary border-y'>
                <div
                    dangerouslySetInnerHTML={{ __html: data?.content }}
                >
                </div>
            </div>
            <div className='comment-doctor h-[50px]'>

            </div>
        </div>
    )
}

export default DetailDoctor