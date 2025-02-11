//Create User
import Store from "./include/Store"
//pagination
import Paginate from "@/components/Paginate"
import { destroy, pagination } from "@/service/TimeSlotService"
//breadcrumb
import PageHeading from "@/components/heading"
import { Breadcrumb } from "@/types/Breadcrumb"
//table
import CustomTable from "@/components/CustomTable"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import useTable from "@/hook/useTable"
//filter
import Filter from "@/components/Filter"
//Checkbox
import useCheckBoxState from "@/hook/useCheckBoxState"
//settings
import { SelectConfig } from "@/components/CustomFilter"
import { breadcrumb, buttonActions, tableColumn } from "@/modules/TimeSlot/settings/"
import { filterItems } from "@/settings/globalSettings"
import dayjs from "dayjs"
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
import { TableProvider } from "@/contexts/TableContext"
//
import CustomDialog from "@/components/CustomDialog"
import { TimeSlot as TTimeSlot } from "@/interfaces/types/TimeSlotType"
import { useCallback, useEffect, useState } from "react"
const TimeSlot = () => {
    const model = 'time_slots'
    const breadcrumbData: Breadcrumb = breadcrumb.index

    const [openDialog, setOpenDialog] = useState<boolean>()

    const handleOpenDialog = useCallback(() => {
        setOpenDialog(true)
    }, [])

    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()

    const [customFilter, setCustomFilter] = useState<SelectConfig[]>([]);
    const [customData, setCustomData] = useState<{ [key: string]: TTimeSlot[] } | undefined>(undefined)

    useEffect(() => {
        if (!isLoading) {
            const formatData = {
                [model]: data[model].map((value: TTimeSlot) => ({
                    ...value,
                    start_time: dayjs(value.start_time).format('hh:mm A'),
                    end_time: dayjs(value.end_time).format('hh:mm A'),
                }))
            };
            setCustomData(formatData)
        }
    }, [refetch, data, isLoading])

    return (
        <TableProvider model={model} pagination={pagination}>
            <FilterProvider customFilters={customFilter}>
                <PageHeading breadcrumb={breadcrumbData} />
                <div className="container">
                    <Card className="rounded-[5px] mt-[15px] ">
                        <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                            <CardTitle className="uppercase">Quản lý danh sách thời gian khám</CardTitle>
                            <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách thời gian khám, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
                        </CardHeader>
                        <CardContent className="p-[15px]">
                            <Filter
                                isAnyChecked={somethingChecked}
                                checkedState={checkedState}
                                model={model}
                                refetch={refetch}
                                handleQueryString={(filters: any) => handleQueryString(filters)}
                                openDialog={handleOpenDialog}
                                items={filterItems}
                                buttonText="Thêm mới thời gian khám"
                            />
                            <CustomTable
                                isLoading={isLoading}
                                data={customData || []}
                                isError={isError}
                                model={model}
                                tableColumn={tableColumn}
                                checkedState={checkedState}
                                checkedAllState={checkedAllState}
                                handleCheckedChange={handleCheckedChange}
                                handleCheckedAllChange={handleCheckedAllChange}
                                destroy={destroy}
                                refetch={refetch}
                                buttonActions={buttonActions}
                            />
                        </CardContent>
                        <CardFooter>
                            {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                        </CardFooter>
                    </Card>
                    {openDialog && (
                        <CustomDialog
                            heading="Thêm thời gian mới"
                            description=""
                            buttonLoading={false}
                            open={openDialog}
                            close={() => setOpenDialog(false)}
                        >
                            <Store
                                close={() => setOpenDialog(false)}
                            />
                        </CustomDialog>
                    )}
                </div >
            </FilterProvider>
        </TableProvider>
    )
}
export default TimeSlot