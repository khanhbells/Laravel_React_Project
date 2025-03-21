import CustomHelmet from "@/components/CustomHelmet";
import DetailAnalytics from "@/components/DetailAnalytics";
import InforDetailDoctor from "@/components/InforDetailDoctor";
import Parent from "@/components/Parent";
import { queryKey } from "@/constant/query";
import { getDropdown } from "@/helper/myHelper";
import { setIdDoctor } from "@/redux/slide/idDoctorSlice";
import { RootState } from "@/redux/store";
import { detailAnalytics } from "@/service/DashboardService";
import { findById, paginationDoctor } from "@/service/DoctorService";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import PageHeading from "../../components/heading";

const DetailDashboard = () => {
    const breadcrumb = {
        title: "Thống kê chi tiết",
        route: "detail/dashboard",
    };
    const methods = useForm<any>({
        mode: "onSubmit",
    });

    const { isAuthenticated, idDoctor } = useSelector(
        (state: RootState) => state.idDoctor
    );

    const { data, isLoading, isError, refetch } = useQuery(
        ["detail_analytics", idDoctor],
        () => detailAnalytics(idDoctor),
        {
            enabled: idDoctor !== null,
        }
    );

    const { data: dataInforDoctor, isLoading: isLoadingDataInfoDoctor } =
        useQuery(
            ["doctor_info", idDoctor],
            () => findById(idDoctor, "doctors_detail_info"),
            {
                enabled: idDoctor !== null,
            }
        );

    //useQuery
    const {
        data: dropdown,
        isLoading: isDropdownLoading,
        isError: isDropDownError,
    } = useQuery([], () => paginationDoctor("perpage=100"));
    //Dropdown Select Parent
    const doctors = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown["doctors"] ? getDropdown(dropdown["doctors"]) : [];
        }
        return [];
    }, [dropdown]);

    return (
        <>
            <CustomHelmet
                meta_title="Detail Dashboard - Thống kê doanh thu chi tiết"
                meta_description="Xem thống kê doanh thu chi tiết và hiệu suất kinh doanh của bạn."
                meta_keyword="thống kê, doanh thu, dashboard, kinh doanh"
                canonical={breadcrumb.route}
            />
            <PageHeading breadcrumb={breadcrumb} />
            <FormProvider {...methods}>
                <div className="page-container ">
                    <div className="p-[15px]">
                        <div className="grid grid-cols-12 gap-4 ">
                            <DetailAnalytics
                                data={data}
                                isLoading={isLoading}
                            />
                            <div className="col-span-4">
                                {dropdown && (
                                    <Parent
                                        name="doctor_id"
                                        options={doctors}
                                        label="Bác sĩ"
                                        setId={setIdDoctor}
                                    />
                                )}
                                <InforDetailDoctor
                                    dataInforDoctor={dataInforDoctor}
                                    isLoadingDataInfoDoctor={
                                        isLoadingDataInfoDoctor
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </FormProvider>
        </>
    );
};

export default DetailDashboard;
