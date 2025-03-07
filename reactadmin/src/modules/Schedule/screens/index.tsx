//pagination
import Paginate from "@/components/Paginate";
import { destroy, pagination } from "@/service/ScheduleService";
//breadcrumb
import PageHeading from "@/components/heading";
import { Breadcrumb } from "@/types/Breadcrumb";
//table
import CustomTable from "@/components/CustomTable";
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
//settings
import { filterItems } from "@/settings/globalSettings";
import { breadcrumb, buttonActions, tableColumn } from "../settings";
//contexts
import { FilterProvider } from "@/contexts/FilterContext";
//react
import { useCustomFilter } from "@/hook/useCustomFilter";
import { useMemo } from "react";
import useSheet from "@/hook/useSheet";
import CustomSheet from "@/components/CustomSheet";
import UpdateSchedule from "./include/UpdateSchedule";
import { useQuery } from "react-query";
import { queryKey } from "@/constant/query";
import { useUserContext } from "@/contexts/UserContext";
//Service
import { pagination as doctorsPagination } from "@/service/DoctorService";
const Schedule = () => {
    const model = "schedules";
    const breadcrumbData: Breadcrumb = breadcrumb.index;
    const { isSheetOpen, openSheet, closeSheet } = useSheet();

    //CONTEXT
    const { user } = useUserContext();
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
    //SELECT FILTER
    const {
        data: doctors,
        isLoading: isDoctorLoading,
        isError: isDoctorError,
    } = useQuery([queryKey.doctors], () => doctorsPagination(""), {
        enabled: user?.user_catalogue_id === 1,
    });

    const filterInitial = useMemo(() => {
        if (doctors && user?.user_catalogue_id === 1) {
            return [
                {
                    name: "user_id",
                    placeholder: "Chọn tên bác sĩ",
                    data: doctors?.["users"],
                    isLoading: isDoctorLoading,
                    isNested: true,
                    valueKey: "id",
                    labelKey: "name",
                },
            ];
        }
        return [];
    }, [doctors, user]);

    /* 
       - Phân loại được là kiểu hiện có hiển thị theo kiểu danh mục cha con không: isNested:true/ false --> false
       - Key và label thì phải custom được vì có thể là nó sẽ không theo cái tiêu chí là id và name
       - Trạng thái của dữ liệu: Loading vv...
    */

    const customFilter = useCustomFilter(filterInitial);

    return (
        <FilterProvider customFilters={customFilter}>
            <PageHeading breadcrumb={breadcrumbData} />
            <div className="container">
                <Card className="rounded-[5px] mt-[15px] ">
                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                        <CardTitle className="uppercase">
                            Quản lý danh sách lịch khám bệnh
                        </CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">
                            Hiển thị danh sách lịch khám bệnh, sử dụng các chức
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
                            buttonText="Thêm mới lịch khám bệnh"
                            to="/schedule/create"
                            filterDate={true}
                        />
                        <CustomTable
                            isLoading={isLoading}
                            data={data}
                            isError={isError}
                            model={model}
                            tableColumn={tableColumn}
                            checkedState={checkedState}
                            openSheet={openSheet}
                            checkedAllState={checkedAllState}
                            handleCheckedChange={handleCheckedChange}
                            handleCheckedAllChange={handleCheckedAllChange}
                            destroy={destroy}
                            refetch={refetch}
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
                        title={
                            isSheetOpen.action === "update"
                                ? breadcrumb.update.title
                                : breadcrumb.create.title
                        }
                        description={breadcrumb.create.description}
                        isSheetOpen={isSheetOpen.open}
                        closeSheet={closeSheet}
                        className="w-[400px] sm:w-[500px]"
                    >
                        <UpdateSchedule
                            refetch={refetch}
                            closeSheet={closeSheet}
                            id={isSheetOpen.id}
                            action={isSheetOpen.action}
                        />
                    </CustomSheet>
                )}
            </div>
        </FilterProvider>
    );
};
export default Schedule;
