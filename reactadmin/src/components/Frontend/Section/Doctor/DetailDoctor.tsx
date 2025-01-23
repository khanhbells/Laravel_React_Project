import '../../../../assets/scss/DetailDoctor.scss'
import DoctorSchedule from './include/DoctorSchedule'
import { useParams } from 'react-router-dom'
import PageHeading from '../Breadcrumb'
import DoctorExtraInfo from './include/DoctorExtraInfo'
import DoctorInfor from './include/DoctorInfor'
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
                <DoctorInfor
                    dataDoctor={dataDoctor}
                    className='px-[200px] py-[10px]'
                />
                <div className='schedule-doctor h-[100%] flex px-[200px] py-[10px] min-h-[200px] bg-sky-100'>
                    <DataScheduleProvider>
                        <div className='content-left w-[50%]'>
                            <DoctorSchedule
                                options={schedules || []}
                                data={getData || []}
                                className='border-primary border-r'
                            />
                        </div>
                        <div className='content-right w-[50%]'>
                            <DoctorExtraInfo
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