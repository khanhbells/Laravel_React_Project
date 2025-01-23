import { useParams } from "react-router-dom"
import PageHeading from "../Breadcrumb";
import { useQuery } from "react-query";
import { findById, pagination } from "@/service/Frontend/FrontEndService";
import { endpoint } from "@/constant/endpoint";
import { useEffect, useMemo, useState } from "react";
import { queryKey } from "@/constant/query";
import useTableFrontend from "@/hook/useTableFrontend";
import Select from 'react-select'
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import DoctorInfor from "./include/DoctorInfor";
import { LoadingSpinner } from "@/components/ui/loading";
import { DataScheduleProvider } from "@/contexts/DataScheduleContext";
import DoctorSchedule from "./include/DoctorSchedule";
import DoctorExtraInfo from "./include/DoctorExtraInfo";
import { getDropdownDate } from '@/helper/myHelper';
interface IDoctorIndex {
    [key: string]: any
}

const Doctor = () => {
    const model = 'doctors'
    const { catalogueId, catalogue, specialId, specialty } = useParams()
    const query = `&publish=2&specialty_id=${specialId}&permission=true`
    const { isLoading: isLoadingDoctors, data: dataDoctors, isError, refetch, handlePageChange, handleQueryString } = useTableFrontend({ model, pagination, query, endpoint: endpoint.doctors })

    const { data: dataSpecialties, isLoading: isSpecialtiesLoading } = useQuery(
        [queryKey.specialties, specialId],
        () => findById(specialId, endpoint.specialties),
        { enabled: !!dataDoctors && !isLoadingDoctors && dataDoctors.doctors.length === 0 }
    );
    const breadcrumb = [
        {
            title: `Khám chuyên khoa`,
            route: `/homepage/specialty/${catalogueId}/${catalogue}.html`,
        },
        {
            title: `${(dataDoctors && dataDoctors.doctors.length > 0) ? dataDoctors.doctors[0].specialties[0].label : (dataSpecialties) ? dataSpecialties.name : 'Loading...'}`,
            route: `/homepage/specialty/${catalogueId}/${catalogue}/${specialId}/${specialty}.html`,
        },
    ]

    const doctors = dataDoctors?.doctors || [];

    const [isSchedules, setSchedules] = useState<
        { getDatas: any[] | string; schedules: any[] }[]
    >([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            const results = await Promise.all(
                doctors.map(async (doctor: any) => {
                    const data = await pagination(
                        `&publish=2&doctor_id=${doctor.id}&permission=true`,
                        endpoint.schedules
                    );
                    return {
                        schedules: getDropdownDate(data.schedules || []),
                        getDatas: data.schedules
                    };
                })
            );
            setSchedules(results);
        };

        if (doctors.length > 0) {
            fetchSchedules();
        }
    }, [doctors]);


    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <div className="px-[100px] bg-white pb-[10px]">
                <div
                    className="page-heading py-[20px] border-b border-[#e7eaec] text-[25px] font-semibold"
                >
                    {dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].label : (dataSpecialties) ? dataSpecialties.name : 'Loading...'}
                </div>
                <div className="my-[10px] text-[18px]"
                    dangerouslySetInnerHTML={{ __html: dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].description : '' }}
                ></div>
                <div className=""
                    dangerouslySetInnerHTML={{ __html: dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors[0].specialties[0].content : '' }}
                ></div>
            </div>
            <div className="bg-sky-100 min-h-[250px] py-[10px] px-[100px] h-[100%]">
                <div className="mb-[40px]">
                    <Select
                        options={[]}
                        className="w-[150px]"
                        placeholder={'Chọn khu vực'}
                    // onChange={(selected) => handleSelectChange(selected?.value)}
                    // value={options?.find(option => option.value === selectedDate) || null}
                    />
                </div>
                {
                    dataDoctors && dataDoctors.doctors.length > 0 ? dataDoctors.doctors.map((value: IDoctorIndex, index: number) => {
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

export default Doctor