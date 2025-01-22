import '../../../../assets/scss/DetailDoctor.scss'
import DoctorSchedule from './include/DoctorSchedule'
import { useParams } from 'react-router-dom'
import PageHeading from '../Breadcrumb'
import DoctoExtraInfo from './include/DoctorExtraInfo'
//HOOK
import useDetailDoctor from '@/hook/useDetailDoctor'
//CONTEXT
import { DataScheduleProvider } from '@/contexts/DataScheduleContext'
import { LoadingSpinner } from '@/components/ui/loading'
const DetailDoctor = () => {
    const { specialId, doctorId, catalogueId, catalogue } = useParams()
    const { dataDoctor, dataSpecialties, schedules, getData, isDoctorLoading, isSpecialtyLoading } = useDetailDoctor(specialId, doctorId);
    const breadcrumb = [
        {
            title: `Khám chuyên khoa`,
            route: `/homepage/specialty/${catalogueId}/${catalogue}.html`,
        },
        {
            title: `${dataSpecialties ? dataSpecialties.name : 'Loading...'}`,
            route: `/homepage/specialty/${catalogueId}/${catalogue}/${specialId}/${dataSpecialties?.canonical}.html`,
        },
        {
            title: `${dataDoctor ? dataDoctor.name : 'Loading...'}`,
            route: ''
        },
    ]
    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <div className="h-[full]">
                <div className='flex px-[200px] py-[10px] bg-[white] '>
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
                            {`${dataDoctor ? dataDoctor.exp : ''} ${dataDoctor ? dataDoctor.name : 'Loading...'}`}
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
                <div className='schedule-doctor h-[100%] flex px-[200px] py-[10px] min-h-[200px] bg-sky-100'>
                    <DataScheduleProvider>
                        <div className='content-left w-[50%]'>
                            <DoctorSchedule
                                options={schedules || []}
                                data={getData || []}
                            />
                        </div>
                        <div className='content-right w-[50%]'>
                            <DoctoExtraInfo
                                dataDoctor={dataDoctor}
                            />
                        </div>
                    </DataScheduleProvider>
                </div>
                <div className='detail-info-doctor px-[200px] bg-[#f9f9f9] py-[10px] border-primary border-y'>
                    <div
                        dangerouslySetInnerHTML={{ __html: dataDoctor?.content }}
                    >
                    </div>
                </div>
                <div className='comment-doctor h-[50px]'>

                </div>
            </div >
        </>
    )
}

export default DetailDoctor