//Create Store
//pagination
import Paginate from "@/components/Paginate";
import { pagination, stopBooking } from "@/service/HistoryService";
//breadcrumb
import { Breadcrumb } from "@/types/Breadcrumb";
//table
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import useTable from "@/hook/useTable";
//filter
import Filter from "@/components/Filter";
//Checkbox
import useCheckBoxState from "@/hook/useCheckBoxState";
//Sheet Create
import useSheet from "@/hook/useSheet";
//settings
import { filterItems } from "@/settings/globalSettings";
import { breadcrumb, model, tableColumn, buttonActions } from "./settings";
//contexts
import { FilterProvider } from "@/contexts/FilterContext";
//
import TableHistoryPatient from "@/components/TableHistoryPatient";
import { useCustomFilter } from "@/hook/useCustomFilter";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { status } from "@/constant/general";
import CustomSheet from "@/components/CustomSheet";
import Store from "./include/Store";
import CustomHelmet from "@/components/CustomHelmet";
import { fetchPatient } from "@/service/Frontend/AuthPatientService";
import { setAuthPatientLogout } from "@/redux/slide/authPatientSlice";
const History = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, patient: patientRedux } = useSelector(
        (state: RootState) => state.patient
    );

    useMemo( async () => { 
        const response = await fetchPatient();
        if (response && response.publish === 1 || !response) {
            dispatch(setAuthPatientLogout());
        }
    }, []);

    //REACT QUERY
    const {
        isLoading,
        data,
        isError,
        refetch,
        handlePageChange,
        handleQueryString,
    } = useTable({ model, pagination });
    //Checkbox
    const {
        checkedState,
        checkedAllState,
        handleCheckedChange,
        handleCheckedAllChange,
        isAnyChecked,
    } = useCheckBoxState(data, model, isLoading);
    const somethingChecked = isAnyChecked();
    const { isSheetOpen, openSheet, closeSheet } = useSheet();
    const filterInitial = useMemo(() => {
        return [];
    }, []);

    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (patientRedux !== undefined) {
            setIsDataLoaded(true);
        }
    }, [patientRedux]);

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        if (patientRedux !== null || isAuthenticated) {
            setIsCheckingAuth(false);
        }
    }, [patientRedux, isAuthenticated]);

    useEffect(() => {
        if (isCheckingAuth) return;
        if (!isAuthenticated && patientRedux === null) {
            navigate(-1);
        }
    }, [isCheckingAuth, isAuthenticated, patientRedux, navigate]);

    const customFilter = useCustomFilter(filterInitial);

    return (
        <>
            <CustomHelmet
                meta_title={"Lịch sử khám"}
                meta_keyword={"history"}
                meta_description={"Đây là trang lịch sử khám bệnh"}
                canonical={`homepage/history/${patientRedux?.id}`}
            />
            <FilterProvider customFilters={customFilter}>
                <div className="page-heading py-[20px] bg-white border-b border-[#e7eaec]">
                    <div className="px-[10px]">
                        <h2 className="text-[24px] mb-[5px]">
                            {breadcrumbData.title}
                        </h2>
                    </div>
                </div>
                <div className="container">
                    <Card className="rounded-[5px] mt-[15px] ">
                        <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                            <CardTitle className="uppercase">
                                Danh sách lịch sử đặt lịch hẹn khám bệnh của{" "}
                                <span className="text-[#f00]">
                                    {patientRedux?.name}
                                </span>
                            </CardTitle>
                            <CardDescription className="text-xs text-[#f00000]">
                                Hiển thị danh sách lịch hẹn, sử dụng các chức
                                năng bên dưới để lọc theo mong muốn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-[15px]">
                            <Filter
                                isAnyChecked={somethingChecked}
                                checkedState={checkedState}
                                model={model}
                                refetch={refetch}
                                handleQueryString={(filters: any) =>
                                    handleQueryString(filters)
                                }
                                items={filterItems}
                                status={status}
                            />
                            <TableHistoryPatient
                                isLoading={isLoading}
                                data={data}
                                isError={isError}
                                model={model}
                                tableColumn={tableColumn}
                                checkedState={checkedState}
                                checkedAllState={checkedAllState}
                                handleCheckedChange={handleCheckedChange}
                                handleCheckedAllChange={handleCheckedAllChange}
                                openSheet={openSheet}
                                refetch={refetch}
                                flag={true}
                                stopBooking={stopBooking}
                                buttonActions={buttonActions}
                            />
                        </CardContent>
                        <CardFooter>
                            {!isLoading && data[model] && data.links ? (
                                <Paginate
                                    links={data?.links}
                                    pageChange={handlePageChange}
                                />
                            ) : null}
                        </CardFooter>
                    </Card>
                    {isSheetOpen && (
                        <CustomSheet
                            title={breadcrumb.medicines.title}
                            description={breadcrumb.medicines.description}
                            isSheetOpen={isSheetOpen.open}
                            closeSheet={closeSheet}
                            className="w-[400px] sm:w-[550px]"
                        >
                            <Store
                                refetch={refetch}
                                closeSheet={closeSheet}
                                id={isSheetOpen.id}
                                action={isSheetOpen.action}
                            />
                        </CustomSheet>
                    )}
                </div>
            </FilterProvider>
        </>
    );
};
export default History;
