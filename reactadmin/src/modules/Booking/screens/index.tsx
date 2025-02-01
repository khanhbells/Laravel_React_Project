//Create Store
import Store from "./include/Store"
//pagination
import { pagination, destroy } from "@/service/BookingService"
import Paginate from "@/components/paginate"
//breadcrumb
import PageHeading from "@/components/heading"
import { Breadcrumb } from "@/types/Breadcrumb"
//table
import CustomTable from "@/components/customTable"
import useTable from "@/hook/useTable"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
//filter
import Filter from "@/components/Filter"
//Checkbox
import useCheckBoxState from "@/hook/useCheckBoxState"
//Sheet Create
import useSheet from "@/hook/useSheet"
import CustomSheet from "@/components/CustomSheet"
//settings
import { breadcrumb, tableColumn, model, buttonActions } from "../setting"
import { filterItems } from "@/settings/globalSettings"
import { SelectConfig } from "@/components/CustomFilter"
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
//
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "@/contexts/UserContext"
import { useQuery } from "react-query"
import { queryKey } from "@/constant/query"
import { pagination as doctorsPagination } from "@/service/DoctorService"
import { useCustomFilter } from "@/hook/useCustomFilter"
import { status } from "@/constant/general"
const Booking = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index
    const navigate = useNavigate()

    //CONTEXT
    const { user } = useUserContext()

    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()
    const { isSheetOpen, openSheet, closeSheet } = useSheet()
    //SELECT FILTER
    const { data: doctors, isLoading: isDoctorLoading, isError: isDoctorError } = useQuery([queryKey.doctors], () => doctorsPagination(''), {
        enabled: user?.user_catalogue_id === 1
    })

    const filterInitial = useMemo(() => {
        if (doctors && user?.user_catalogue_id === 1) {
            return [
                {
                    name: 'user_id',
                    placeholder: 'Chọn tên bác sĩ',
                    data: doctors?.['users'],
                    isLoading: isDoctorLoading,
                    isNested: true,
                    valueKey: 'id',
                    labelKey: 'name'
                }
            ]
        } return []
    }, [doctors, user])

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
                        <CardTitle className="uppercase">Quản lý danh sách booking</CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách booking, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
                    </CardHeader>
                    <CardContent className="p-[15px]">
                        <Filter
                            isAnyChecked={somethingChecked}
                            checkedState={checkedState}
                            model={model}
                            refetch={refetch}
                            handleQueryString={(filters: any) => handleQueryString(filters)}
                            items={filterItems}
                            status={status}
                            filterDate={true}
                        />
                        <CustomTable
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
                            destroy={destroy}
                            refetch={refetch}
                            buttonActions={buttonActions}
                            flag={true}
                            status={status}
                        />
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
                {isSheetOpen && (
                    <CustomSheet
                        title={breadcrumb.update.title}
                        description={breadcrumb.update.description}
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
            </div >
        </FilterProvider>
    )
}
export default Booking