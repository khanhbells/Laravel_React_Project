import { memo } from "react"
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import DoctorInfor from "./Frontend/Section/Doctor/include/DoctorInfor";
import { DataScheduleProvider } from "@/contexts/DataScheduleContext";
import DoctorSchedule from "./Frontend/Section/Doctor/include/DoctorSchedule";
import DoctorExtraInfo from "./Frontend/Section/Doctor/include/DoctorExtraInfo";
import { LoadingSpinner } from "./ui/loading";
interface ICustomListContent {
    [key: string]: any
}

interface ICustomListContent {
    dataDoctors: any,
    isLoadingDoctors: boolean,
    isSchedules: any,
    catalogueId?: string,
    catalogue?: string,
    specialty?: string

}

const CustomListContent = ({
    dataDoctors,
    isLoadingDoctors,
    isSchedules,
    catalogue,
    catalogueId,
    specialty,
    specialId
}: ICustomListContent) => {
    return (
        <>
            <div>
                {
                    dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors.map((value: ICustomListContent, index: number) => {
                        return (
                            <Card className="mb-[20px] h-[100%] " key={index}>
                                <CardContent className="flex pt-[10px] grid grid-cols-12">
                                    <div className="border-r border-sky-200 col-span-6">
                                        <DoctorInfor
                                            dataDoctor={value}
                                            params={`/homepage/specialty/${catalogueId}/${catalogue}/${specialId}/${specialty}/${value.id}/${value.canonical}.html`}
                                        />
                                    </div>
                                    <div
                                        className="ml-[10px] col-span-6"
                                    >
                                        <DataScheduleProvider>
                                            <div>
                                                <div className="h-[50%]">
                                                    <DoctorSchedule
                                                        options={isSchedules[index]?.schedules || []} // Mặc định là mảng rỗng
                                                        data={isSchedules[index]?.getDatas || []}  // Mặc định là null
                                                    />
                                                </div>
                                                <div className="h-[50%] border-t border-sky-200 pt-[10px]">
                                                    <DoctorExtraInfo
                                                        dataDoctor={value}
                                                    />
                                                </div>
                                            </div>
                                        </DataScheduleProvider>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }) : isLoadingDoctors ? (
                        <div className="flex items-center justify-center w-full">
                            <LoadingSpinner className="mr-[5px]" />
                            Loading...
                        </div>
                    ) : (
                        <div className="italic text-[#000] text-center">
                            Hiện tại chưa có bác sĩ nào của chúng tôi thuộc khoa này xin các bạn thông cảm, chúng tôi sẽ cố gắng tìm kiếm được bác sĩ nhanh nhất có thể trong thời gian sắp tới!
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default memo(CustomListContent)