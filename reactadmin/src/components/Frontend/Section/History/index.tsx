//Create Store
//pagination
import { pagination } from "@/service/HistoryService"
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
import { breadcrumb, tableColumn, model } from "./settings"
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
import TableHistoryPatient from "@/components/TableHistoryPatient"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

import { status } from "@/constant/general"
const History = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index
    const navigate = useNavigate()
    const { isAuthenticated, patient: patientRedux } = useSelector((state: RootState) => state.patient)

    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()
    const { isSheetOpen, openSheet, closeSheet } = useSheet()
    //SELECT FILTER
    // const { data: doctors, isLoading: isDoctorLoading, isError: isDoctorError } = useQuery([queryKey.doctors], () => doctorsPagination(''), {
    //     enabled: user?.user_catalogue_id === 1
    // })

    // const filterInitial = useMemo(() => {
    //     if (doctors && user?.user_catalogue_id === 1) {
    //         return [
    //             {
    //                 name: 'user_id',
    //                 placeholder: 'Chọn tên bác sĩ',
    //                 data: doctors?.['users'],
    //                 isLoading: isDoctorLoading,
    //                 isNested: true,
    //                 valueKey: 'id',
    //                 labelKey: 'name'
    //             }
    //         ]
    //     } return []
    // }, [doctors, user])
    const filterInitial = useMemo(() => {
        return []
    }, [])

    useEffect(() => {
        if (!patientRedux || patientRedux == null) {
            navigate(-1)
        }
    }, [patientRedux, navigate])

    const customFilter = useCustomFilter(filterInitial);

    return (
        <FilterProvider customFilters={customFilter}>
            <div className="page-heading py-[20px] bg-white border-b border-[#e7eaec]">
                <div className="px-[10px]">
                    <h2 className="text-[24px] mb-[5px]">{breadcrumbData.title}</h2>
                </div>
            </div>
            <div className="container">
                <Card className="rounded-[5px] mt-[15px] ">
                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                        <CardTitle className="uppercase">Danh sách lịch sử đặt lịch hẹn khám bệnh của <span className="text-[#f00]">{patientRedux?.name}</span></CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách lịch hẹn, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
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
                        />
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
            </div >
        </FilterProvider>
    )
}
export default History