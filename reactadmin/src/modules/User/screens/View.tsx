import { useQuery } from "react-query"
//Create User
import UserStore from "./include/Store"
//pagination
import { pagination, destroy, changePassword } from "@/service/UserService"
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
import { breadcrumb, model, tableColumn } from "../settings/userSettings"
import { filterItems } from "@/settings/globalSettings"
import { SelectConfig } from "@/components/CustomFilter"
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType"
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
//
import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { buttonActions } from "../settings/userSettings"
import { pagination as userCataloguePagination } from "@/service/UserCatalogueService"
const User = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index
    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()
    const { isSheetOpen, openSheet, closeSheet } = useSheet()

    const { data: dataUserCatalogues, isLoading: isUserCatalogueLoading, isError: isUserCatalogueError } = useQuery(['user_catalogues'],
        () => userCataloguePagination('sort=name,asc'),
    )

    const userCatalogues = useMemo(() => {
        if (!isUserCatalogueLoading && dataUserCatalogues) {
            return dataUserCatalogues['user_catalogues'] && dataUserCatalogues['user_catalogues'].map((userCatalogueItem: UserCatalogue) => ({
                value: String(userCatalogueItem.id),
                label: String(userCatalogueItem.name)
            }))
        }
        return []
    }, [dataUserCatalogues, isUserCatalogueLoading])


    const [customFilter, setCustomFilter] = useState<SelectConfig[]>([
        {
            name: 'user_catalogue_id',
            placeholder: 'Chọn nhóm thành viên',
            options: []
        },
    ]);

    const setCustomFilterCallback = useCallback((prevState: SelectConfig[]) =>
        prevState.map((item) =>
            item.name === 'user_catalogue_id'
                ? { ...item, options: [{ value: 0, label: 'Tất cả các nhóm' }, ...userCatalogues] } : item
        ), [userCatalogues])

    useEffect(() => {
        if (userCatalogues) {
            setCustomFilter(setCustomFilterCallback)
        }
    }, [userCatalogues])

    return (
        <FilterProvider customFilters={customFilter}>
            <PageHeading breadcrumb={breadcrumbData} />
            <div className="container">
                <Card className="rounded-[5px] mt-[15px] ">
                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[20px]">
                        <CardTitle className="uppercase">Quản lý danh sách thành viên</CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách thành viên, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
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
                            buttonText="Thêm mới thành viên"
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
                        <UserStore
                            refetch={refetch}
                            closeSheet={closeSheet}
                            id={isSheetOpen.id}
                            action={isSheetOpen.action}
                            userCatalogueData={userCatalogues}
                        />
                    </CustomSheet>
                )}
            </div >
        </FilterProvider>
    )
}
export default User