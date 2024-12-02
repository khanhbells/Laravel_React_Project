import { Link, useSearchParams, useNavigate } from "react-router-dom"
import PageHeading from "../../../components/heading"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import { useEffect, useState } from "react"
import { Checkbox } from "../../../components/ui/checkbox"
import { Switch } from "../../../components/ui/switch"
import { Button } from "../../../components/ui/button"
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineLockReset } from "react-icons/md";
import { pagination, breadcrumb, model } from "../../../service/UserService"
import { useQuery } from "react-query"
import { LoadingSpinner } from "../../../components/ui/loading"
import Paginate from "../../../components/paginate"
import { Breadcrumb } from "../../../types/Breadcrumb"
import useColumnState from "../../../hook/useColumnState"



const User = () => {
    const breadcrumbData: Breadcrumb = breadcrumb
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const [page, setPage] = useState<number | null>(currentPage)

    //REACT QUERY
    const { isLoading, data, isError, error, refetch } = useQuery(['users', page], () => pagination(page))


    /* Column State */
    const { columnState, handleChecked, setInitialColumnState } = useColumnState()
    //Pagination
    const handlePageChange = (page: number | null) => {
        setPage(page)
        navigate(`?page=${page}`)
    }

    useEffect(() => {
        if (!isLoading && data.users) {
            setInitialColumnState(data.users, 'publish')
        }
    }, [isLoading])

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
                        <Table className="border border-solid border-[#ebebeb]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Checkbox id="checkAll" className="text-white" />
                                    </TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Họ Tên</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Địa chỉ</TableHead>
                                    <TableHead>Nhóm Thành Viên</TableHead>
                                    <TableHead className="text-center">Tình trạng</TableHead>
                                    <TableHead className="text-center">Tác vụ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center items-center">
                                            <LoadingSpinner className="inline-block mr-[5px]" />
                                            Loading...
                                        </TableCell>
                                    </TableRow>

                                ) : isError ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-[12px] text-[#f00000]">
                                            Có lỗi xảy ra trong quá trình truy xuất dữ liệu. Hãy thử lại sau
                                        </TableCell>
                                    </TableRow>
                                ) : data.users && data.users.map((user: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            <Checkbox id="checkAll" className="text-white" />
                                        </TableCell>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.phone ?? '-'}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.address ?? '-'}</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell className="text-center">
                                            <Switch value={user.id} checked={columnState[user.id]?.publish} onCheckedChange={() => handleChecked(user.id, 'publish', model)} />
                                        </TableCell>
                                        <TableCell className="flex justify-center">
                                            <Button className="flex mr-[5px]">
                                                <Link className="block" to="/user/update"><FaRegEdit className="text-white" /></Link>
                                            </Button>
                                            <Button className="bg-[#ec4758] mr-[5px]">
                                                <Link to="/user/delete"><RiDeleteBin6Line className="text-white" /></Link>
                                            </Button>
                                            <Button className="bg-[#f8ac59]">
                                                <Link to="/user/reset"><MdOutlineLockReset className="text-white text-[20px]" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        {!isLoading && data.links.length ? <Paginate links={data?.links} pageChange={handlePageChange} /> : null}
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}
export default User