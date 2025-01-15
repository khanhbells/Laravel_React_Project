import { useQuery } from "react-query"
//Create Patient
import Store from "./include/Store"
//pagination
import { pagination, destroy, changePassword } from "@/service/PatientService"
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
import { breadcrumb, model, tableColumn, buttonActions } from "../settings/patientSettings"
import { filterItems } from "@/settings/globalSettings"
import { SelectConfig } from "@/components/CustomFilter"
import { PatientCatalogue } from "@/interfaces/types/PatientCatalogueType"
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
//
import { useState, useMemo, useEffect, useCallback } from "react"
import { pagination as patientCataloguePagination } from "@/service/PatientCatalogueService"
const Patient = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index
    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()
    const { isSheetOpen, openSheet, closeSheet } = useSheet()

    const { data: dataPatientCatalogues, isLoading: isPatientCatalogueLoading, isError: isPatientCatalogueError } = useQuery(['patient_catalogues'],
        () => patientCataloguePagination('sort=name,asc'),
    )

    const patientCatalogues = useMemo(() => {
        if (!isPatientCatalogueLoading && dataPatientCatalogues) {
            return dataPatientCatalogues['patient_catalogues'].map((patientCatalogueItem: PatientCatalogue) => ({
                value: String(patientCatalogueItem.id),
                label: String(patientCatalogueItem.name)
            }))
        }
        return []
    }, [dataPatientCatalogues, isPatientCatalogueLoading])


    const [customFilter, setCustomFilter] = useState<SelectConfig[]>([
        {
            name: 'patient_catalogue_id',
            placeholder: 'Chọn nhóm bệnh nhân',
            options: []
        },
    ]);

    const setCustomFilterCallback = useCallback((prevState: SelectConfig[]) =>
        prevState.map((item) =>
            item.name === 'patient_catalogue_id'
                ? { ...item, options: [{ value: 0, label: 'Tất cả các nhóm' }, ...patientCatalogues] } : item
        ), [patientCatalogues])

    useEffect(() => {
        if (patientCatalogues.length) {
            setCustomFilter(setCustomFilterCallback)
        }
    }, [patientCatalogues])

    return (
        <FilterProvider customFilters={customFilter}>
            <PageHeading breadcrumb={breadcrumbData} />
            <div className="container">
                <Card className="rounded-[5px] mt-[15px] ">
                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                        <CardTitle className="uppercase">Quản lý danh sách bệnh nhân</CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách bệnh nhân, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
                    </CardHeader>
                    <CardContent className="p-[15px]">
                        <Filter
                            isAnyChecked={somethingChecked}
                            checkedState={checkedState}
                            model={model}
                            refetch={refetch}
                            handleQueryString={(filters: any) => handleQueryString(filters)}
                            openSheet={openSheet}
                            items={filterItems}
                            buttonText="Thêm mới bệnh nhân"
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
                            changePassword={changePassword}
                            buttonActions={buttonActions}
                        />
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
                {isSheetOpen && (
                    <CustomSheet
                        title={isSheetOpen.action === 'update' ? breadcrumb.update.title : breadcrumb.create.title}
                        description={breadcrumb.create.description}
                        isSheetOpen={isSheetOpen.open}
                        closeSheet={closeSheet}
                        className="w-[400px] sm:w-[500px]"
                    >
                        <Store
                            refetch={refetch}
                            closeSheet={closeSheet}
                            id={isSheetOpen.id}
                            action={isSheetOpen.action}
                            patientCatalogueData={patientCatalogues}
                        />
                    </CustomSheet>
                )}
            </div >
        </FilterProvider>
    )
}
export default Patient