import '../../../assets/scss/DetailDoctor.scss'
import DoctorSchedule from './DoctorSchedule'
import { useParams } from 'react-router-dom'
import PageHeading from './Breadcrumb'
//HOOK
import useDetailDoctor from '@/hook/useDetailDoctor'
const DetailDoctor = () => {
    const { specialId, doctorId } = useParams()
    const { dataDoctor, dataSpecialties, schedules, getData, isDoctorLoading, isSpecialtyLoading } = useDetailDoctor(specialId, doctorId);
    const breadcrumb = [
        {
            title: `${dataSpecialties?.name}`,
            route: `/homepage/${specialId}/${dataSpecialties?.canonical}.html`,
        },
        {
            title: `${dataDoctor?.name}`,
            route: ''
        },
    ]
    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <div className="h-[full]">
                <div className='flex px-[200px] py-[10px] bg-[white] '>
                    <div
                        className='w-[120px] h-[120px] rounded-full bg-cover bg-no-repeat bg-center'
                        style={{ backgroundImage: `url(${dataDoctor && dataDoctor.image})` }}
                    >
                    </div>
                    <div className='w-[80%] flex flex-col pl-[10px]'>
                        {/* up */}
                        <div className='text-[20px] font-semibold pt-[15px]'>
                            {`${dataDoctor?.exp} ${dataDoctor?.name}`}
                        </div>
                        {/* down */}
                        <div className='pt-[10px]'>
                            <span
                                className=''
                                dangerouslySetInnerHTML={{ __html: dataDoctor?.description }}
                            ></span>
                        </div>
                    </div>
                </div>
                <div className='schedule-doctor mx-[100px] h-[200px] flex my-[10px] pl-[65px]'>
                    <div className='content-left w-[50%]'>
                        <DoctorSchedule
                            options={schedules || []}
                            data={getData || []}
                        />
                    </div>
                    <div className='content-right w-[50%]'>

                    </div>
                </div>
                <div className='detail-info-doctor px-[200px] bg-[#f9f9f9] py-[10px] border-primary border-y'>
                    <div
                        dangerouslySetInnerHTML={{ __html: dataDoctor?.content }}
                    >
                    </div>
                </div>
                <div className='comment-doctor h-[50px]'>

                </div>
            </div>
        </>
    )
}

export default DetailDoctor