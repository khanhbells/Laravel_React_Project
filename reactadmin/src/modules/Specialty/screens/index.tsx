//pagination
import Paginate from "@/components/paginate"
import { destroy, pagination } from "@/service/SpecialtyService"
//breadcrumb
import PageHeading from "@/components/heading"
import { Breadcrumb } from "@/types/Breadcrumb"
//table
import CustomTable from "@/components/customTable"
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
import { filterItems } from "@/settings/globalSettings"
import { breadcrumb, buttonActions, tableColumn } from "../settings"
//contexts
import { FilterProvider } from "@/contexts/FilterContext"
//react
import { useCustomFilter } from "@/hook/useCustomFilter"
import { useMemo } from "react"
//Service
const Specialty = () => {
    const model = 'specialties'
    const breadcrumbData: Breadcrumb = breadcrumb.index

    //REACT QUERY
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()

    const filterInitial = useMemo(() => [], [])

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
                        <CardTitle className="uppercase">Quản lý danh sách chuyên khoa</CardTitle>
                        <CardDescription className="text-xs text-[#f00000]">Hiển thị danh sách chuyên khoa, sử dụng các chức năng bên dưới để lọc theo mong muốn</CardDescription>
                    </CardHeader>
                    <CardContent className="p-[15px]">
                        <Filter
                            isAnyChecked={somethingChecked}
                            checkedState={checkedState}
                            model={model}
                            refetch={refetch}
                            handleQueryString={(filters: any) => handleQueryString(filters)}
                            items={filterItems}
                            buttonText="Thêm mới chuyên khoa"
                            to="/specialty/create"
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
                            destroy={destroy}
                            refetch={refetch}
                            buttonActions={buttonActions}
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
export default Specialty