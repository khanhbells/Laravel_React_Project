import CustomDescriptionContent from "@/components/CustomDescriptionContent";
import CustomListContent from "@/components/CustomListContent";
import Paginate from "@/components/Paginate";
import { endpoint } from "@/constant/endpoint";
import { queryKey } from "@/constant/query";
import { getDropdownDate } from '@/helper/myHelper';
import useListContent from "@/hook/useListContent";
import { findById, pagination } from "@/service/Frontend/FrontEndService";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import PageHeading from "../Breadcrumb";
import CustomHelmet from "@/components/CustomHelmet";
import Filter from "@/components/Filter";
import useCheckBoxState from "@/hook/useCheckBoxState";
import { FilterProvider } from "@/contexts/FilterContext"
import { useCustomFilter } from "@/hook/useCustomFilter";
import { getLocationData } from "@/service/BaseService"
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription
} from "@/components/ui/card";
const Doctor = () => {
    const model = 'doctors'
    const { catalogueId, catalogue, specialId, specialty } = useParams()
    //----------QUERY----------------------------------------------------
    const queryData = `&publish=2&specialty_id=${specialId}&permission=true`
    const { isLoading: isLoadingDoctors, data: dataDoctors, isError, refetch, handlePageChange, handleQueryString } = useListContent({ model, pagination, queryData, endpoint: endpoint.doctors })
    const { data: dataSpecialties, isLoading: isSpecialtiesLoading } = useQuery(
        [queryKey.specialties, specialId],
        () => findById(specialId, endpoint.specialties),
    );
    const { isLoading: isProvinceLoading, data: provinces, isError: isProvinceError } = useQuery(['provinces'], () => getLocationData('provinces', undefined))

    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(dataDoctors, model, isLoadingDoctors)
    const somethingChecked = isAnyChecked()


    const breadcrumb = [
        {
            title: `${(dataSpecialties) ? dataSpecialties.cats[0] : 'Loading...'}`,
            route: `/homepage/specialty/${catalogueId}/${catalogue}.html`,
        },
        {
            title: `${(dataSpecialties) ? dataSpecialties.name : 'Loading...'}`,
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

    //Custom Filter
    const filterInitial = useMemo(() => [
        {
            name: 'province_id',
            placeholder: 'Chọn khu vực',
            data: provinces?.['data'],
            isLoading: isProvinceLoading,
            isNested: true,
            valueKey: 'value',
            labelKey: 'label'
        }
    ], [provinces])
    const customFilter = useCustomFilter(filterInitial);

    return (
        <>
            <FilterProvider customFilters={customFilter}>
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
                    <div className="mb-[20px]">
                        <Card className="h-[100%]" >
                            <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                                <CardTitle className="uppercase">Lọc thông tin bác sĩ</CardTitle>
                                <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách bác sĩ, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
                            </CardHeader>
                            <CardContent className=" pt-[10px] grid grid-cols-12">
                                <Filter
                                    isAnyChecked={somethingChecked}
                                    checkedState={checkedState}
                                    model={model}
                                    refetch={refetch}
                                    handleQueryString={(filters: any) => handleQueryString(filters)}
                                    items={[]}
                                    filterDate={true}
                                    closePublish={true}
                                    closeSort={true}
                                    disabledDay={true}
                                />
                            </CardContent>
                        </Card>
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
            </FilterProvider>
        </>
    )
}

export default Doctor