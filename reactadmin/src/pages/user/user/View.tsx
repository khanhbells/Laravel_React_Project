import { useSearchParams, useNavigate } from "react-router-dom"
import PageHeading from "../../../components/heading"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card"
import { useEffect, useState } from "react"
import { pagination, breadcrumb, model } from "../../../service/UserService"
import { useQuery } from "react-query"
import Paginate from "../../../components/paginate"
import { Breadcrumb } from "../../../types/Breadcrumb"

import CustomTable from "../../../components/customTable"
import { tableColumn } from "../../../service/UserService"
import Filter from "../../../components/Filter"

import useCheckBoxState from "@/hook/useCheckBoxState"
const User = () => {
    const breadcrumbData: Breadcrumb = breadcrumb
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const [page, setPage] = useState<number | null>(currentPage)
    //REACT QUERY
    const { isLoading, data, isError, refetch } = useQuery(['users', page], () => pagination(page))
    //Pagination
    const handlePageChange = (page: number | null) => {
        setPage(page)
        navigate(`?page=${page}`)
    }
    //Checkbox
    const { checkedState, checkedAllState, handleCheckedChange, handleCheckedAllChange, isAnyChecked } = useCheckBoxState(data, model, isLoading)
    const somethingChecked = isAnyChecked()


    useEffect(() => {
        setSearchParams({ page: currentPage.toString() })
        refetch()
    }, [page, refetch])


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
                        <Filter isAnyChecked={somethingChecked} />
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
                        />
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data[model] && data.links ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}
export default User