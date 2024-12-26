//Create User
import UserStore from "./Store"
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
import { breadcrumb, model, tableColumn } from "@/settings/user"

const User = () => {
    const breadcrumbData: Breadcrumb = breadcrumb.index
    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()
    const { isSheetOpen, openSheet, closeSheet } = useSheet()

    return (
        <>
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
                            userId={isSheetOpen.id}
                            action={isSheetOpen.action}
                        />
                    </CustomSheet>
                )}

            </div >
        </>
    )
}
export default User