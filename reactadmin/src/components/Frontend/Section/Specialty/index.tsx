import CustomDescriptionContent from "@/components/CustomDescriptionContent";
import CustomListContent from "@/components/CustomListContent";
import Paginate from "@/components/Paginate";
import { endpoint } from "@/constant/endpoint";
import { queryKey } from "@/constant/query";
import { getDropdownDate } from '@/helper/myHelper';
import useListContent from "@/hook/useListContent";
import { findById, pagination } from "@/service/Frontend/FrontEndService";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import PageHeading from "../Breadcrumb";
import CustomHelmet from "@/components/CustomHelmet";


const Doctor = () => {
    const model = 'doctors'
    const { catalogueId, catalogue, specialId, specialty } = useParams()
    const queryData = `&publish=2&specialty_id=${specialId}&permission=true`
    const { isLoading: isLoadingDoctors, data: dataDoctors, isError, refetch, handlePageChange, handleQueryString } = useListContent({ model, pagination, queryData, endpoint: endpoint.doctors })
    const { data: dataSpecialties, isLoading: isSpecialtiesLoading } = useQuery(
        [queryKey.specialties, specialId],
        () => findById(specialId, endpoint.specialties),
    );
    const breadcrumb = [
        {
            title: `${(dataSpecialties) ? dataSpecialties.cats[0] : 'Loading...'}`,
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
                        `publish=2&doctor_id=${doctor.id}&status=OPEN&permission=true`,
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
            <CustomHelmet
                meta_title={dataSpecialties?.meta_title || ''}
                meta_keyword={dataSpecialties?.meta_keyword || ''}
                meta_description={dataSpecialties?.meta_description || ''}
                canonical={`homepage/specialty/${catalogueId}/${catalogue}/${specialId}/${specialty}`}
            />
            <PageHeading breadcrumb={breadcrumb} />
            <CustomDescriptionContent
                dataDoctors={dataDoctors}
                dataSpecialties={dataSpecialties}
            />
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
                <CustomListContent
                    dataDoctors={dataDoctors}
                    isLoadingDoctors={isLoadingDoctors}
                    isSchedules={isSchedules}
                    catalogue={catalogue}
                    catalogueId={catalogueId}
                    specialty={specialty}
                    specialId={specialId}
                />
                <div className="pb-[10px]">
                    {!isLoadingDoctors && dataDoctors[model] && dataDoctors.links ? <Paginate links={dataDoctors?.links} pageChange={handlePageChange} /> : null}
                </div>
            </div>
        </>
    )
}

export default Doctor