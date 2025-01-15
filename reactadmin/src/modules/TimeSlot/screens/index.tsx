//Create User
import Store from "./include/Store"
//pagination
import { pagination, destroy } from "@/service/TimeSlotService"
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
import { breadcrumb, tableColumn, buttonActions } from "@/modules/TimeSlot/settings/"
import { filterItems } from "@/settings/globalSettings"
import { SelectConfig } from "@/components/CustomFilter"
import dayjs from "dayjs";
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
//
import { useCallback, useEffect, useState } from "react"
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomDialog from "@/components/CustomDialog"
import { TimeSlot as TTimeSlot } from "@/interfaces/types/TimeSlotType"
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
    const { isSheetOpen, openSheet, closeSheet } = useSheet()

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
                            openSheet={openSheet}
                            destroy={destroy}
                            refetch={refetch}
                            buttonActions={buttonActions}
                        />
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
                {/* {isSheetOpen && (
                    <CustomSheet
                        title={isSheetOpen.action === 'update' ? breadcrumb.update.title : breadcrumb.create.title}
                        description={breadcrumb.create.description}
                        isSheetOpen={isSheetOpen.open}
                        closeSheet={closeSheet}
                        className="w-[400px] sm:w-[500px]"
                    >

                    </CustomSheet>

                )} */}
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
                            refetch={refetch}
                        />
                    </CustomDialog>
                )}
            </div >
        </FilterProvider>
    )
}
export default TimeSlot