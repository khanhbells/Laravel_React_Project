import '../../../../assets/scss/DetailDoctor.scss'
import DoctorSchedule from './include/DoctorSchedule'
import { useParams } from 'react-router-dom'
import PageHeading from '../Breadcrumb'
import DoctorExtraInfo from './include/DoctorExtraInfo'
import DoctorInfor from './include/DoctorInfor'
import CustomSheet from "@/components/CustomSheet"

//HOOK
import useDetailDoctor from '@/hook/useDetailDoctor'
//CONTEXT
import { DataScheduleProvider } from '@/contexts/DataScheduleContext'
import useSheet from "@/hook/useSheet"
import StoreBookingPatient from './include/StoreBookingPatient'
import CustomHelmet from '@/components/CustomHelmet'

const DetailDoctor = () => {
    const { specialId, doctorId, catalogueId, catalogue, doctor } = useParams()
    const { dataDoctor, dataSpecialties, schedules, getData, isDoctorLoading, isSpecialtyLoading } = useDetailDoctor(specialId, doctorId);
    const { isSheetOpen, openSheet, closeSheet } = useSheet()

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
            <CustomHelmet
                meta_title={dataDoctor?.meta_title || ''}
                meta_keyword={dataDoctor?.meta_keyword || ''}
                meta_description={dataDoctor?.meta_description || ''}
                canonical={`homepage/specialty/${catalogueId}/${catalogue}/${specialId}/${dataSpecialties?.canonical}/${doctorId}/${doctor}`}
            />
            <DataScheduleProvider>
                <PageHeading breadcrumb={breadcrumb} />
                <div className="h-[full]">
                    <DoctorInfor
                        dataDoctor={dataDoctor}
                        className='px-[200px] py-[10px]'
                    />
                    <div className='schedule-doctor h-[100%] flex px-[200px] py-[10px] min-h-[200px] bg-sky-100'>

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
                                openSheet={openSheet}
                            />
                        </div>

                    </div>
                    <div className='detail-info-doctor px-[200px] bg-[#f9f9f9] py-[10px] border-primary border-y'>
                        <div
                            dangerouslySetInnerHTML={{ __html: dataDoctor?.content }}
                        >
                        </div>
                    </div>
                    <div className='comment-doctor h-[50px]'> </div>

                </div >

                {isSheetOpen && (
                    <div className='z-auto'>
                        <CustomSheet
                            title={'Đơn đăng ký khám bệnh'}
                            description={'Vui lòng điền đầy đủ thông tin cá nhân trước khi xác nhận lịch khám'}
                            isSheetOpen={isSheetOpen.open}
                            closeSheet={closeSheet}
                            className="w-[400px] sm:w-[600px] z-99999"
                        >
                            <StoreBookingPatient
                                dataDoctor={dataDoctor}
                                schedules={schedules}
                                closeSheet={closeSheet}
                            />
                        </CustomSheet>
                    </div>
                )}
            </DataScheduleProvider>
        </>
    )
}

export default DetailDoctor